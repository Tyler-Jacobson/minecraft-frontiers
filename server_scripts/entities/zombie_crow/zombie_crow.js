let LivingEntity = Java.loadClass('net.minecraft.world.entity.LivingEntity')
let CustomGoal = Java.loadClass("net.liopyu.entityjs.util.ai.CustomGoal")
let $MoveGoalFlag = Java.loadClass("net.minecraft.world.entity.ai.goal.Goal$Flag")
let DefaultRandomPos = Java.loadClass("net.minecraft.world.entity.ai.util.DefaultRandomPos")
let ClipContext = Java.loadClass('net.minecraft.world.level.ClipContext')
let HitResult = Java.loadClass('net.minecraft.world.phys.HitResult')
let CompoundTag = Java.loadClass('net.minecraft.nbt.CompoundTag')

const ZOMBIE_CROW_EGG_MAX_HEALTH = 200
const ZOMBIE_CROW_EGG_MAX_PHASE = 3

global.zombieCrowGetFleeState = entity => {
    let rawIsFleeingValue = entity.getSyncedData('isFleeing')
    let fleeStateFromStrictBoolean = rawIsFleeingValue === true
    let normalizedFleeState = fleeStateFromStrictBoolean
    if (entity.age % 20 === 0) {
        console.log(`[ZC-TRACE] 14 flee-state read raw=${rawIsFleeingValue} type=${typeof rawIsFleeingValue} strictBool=${fleeStateFromStrictBoolean} normalized=${normalizedFleeState} age=${entity.age}`)
    }
    return normalizedFleeState
}

global.spawnZombieCrowDebugSmoke = (level, defendingPos, attackAngle, smokeMatrix, smokeSpacing) => {
    let horizontalLength = Math.sqrt(attackAngle.x() * attackAngle.x() + attackAngle.z() * attackAngle.z())
    if (horizontalLength === 0) {
        return
    }

    let forwardX = attackAngle.x() / horizontalLength
    let forwardZ = attackAngle.z() / horizontalLength
    let leftX = -forwardZ
    let leftZ = forwardX
    let smokeY = defendingPos.y()
    let spacing = Number(smokeSpacing)
    if (!Number.isFinite(spacing) || spacing <= 0) {
        spacing = 1
    }

    // Matrix layout:
    // 5x5 matrix:
    // row 0 = far forward, row 2 = center, row 4 = far backward
    // col 0 = far left,    col 2 = center, col 4 = far right
    for (let rowIndex = 0; rowIndex < 5; rowIndex++) {
        let row = smokeMatrix[rowIndex]
        if (!row) {
            continue
        }
        for (let columnIndex = 0; columnIndex < 5; columnIndex++) {
            let cellValue = Number(row[columnIndex])
            if (cellValue !== 1) {
                continue
            }

            let forwardFactor = 2 - rowIndex
            let sideFactor = 2 - columnIndex

            let smokeX = defendingPos.x() + (forwardX * forwardFactor * spacing) + (leftX * sideFactor * spacing)
            let smokeZ = defendingPos.z() + (forwardZ * forwardFactor * spacing) + (leftZ * sideFactor * spacing)

            level.spawnParticles('minecraft:smoke', false, smokeX, smokeY, smokeZ, 0, 0, 0, 10, 0.1)
        }
    }
}

EntityJSEvents.addGoalSelectors('frontiers:zombie_crow', event => { // goal selectors
    event.customGoal(
        "fight",
        1,
        entity => { // canUse — fight while not fleeing
            let isFleeing = global.zombieCrowGetFleeState(entity)
            if (entity.age % 20 === 0) {
                console.log(`[ZC-TRACE] 15 fight.canUse result=${!isFleeing}`)
            }
            return !isFleeing
        },
        entity => { // canContinueToUse — keep fighting while not fleeing
            let isFleeing = global.zombieCrowGetFleeState(entity)
            if (entity.age % 20 === 0) {
                console.log(`[ZC-TRACE] 16 fight.canContinue result=${!isFleeing}`)
            }
            return !isFleeing
        },
        false, // isInterruptable
        entity => { console.log(`[ZC-TRACE] 17 fight.onStart uuid=${entity.uuid} age=${entity.age}`) }, // goalOnStartedEvent. this runs once when the goal starts
        entity => { console.log(`[ZC-TRACE] 18 fight.onEnd uuid=${entity.uuid} age=${entity.age}`) }, // goalOnEndedEvent. this runs once when the goal ends
        true, // requiresUpdateEveryTick
        entity => { // goalOnTickEvent. this runs once every tick while the goal is running
            if (entity.age % 20 === 0) {
                console.log(`[ZC-TRACE] 19 fight.onTick age=${entity.age}`)
            }
            global.zombieCrowRunFight(entity)
        }
    )
    event.customGoal(
        "flee",
        2,
        entity => { // canUse — flee when isFleeing is set
            let isFleeing = global.zombieCrowGetFleeState(entity)
            if (entity.age % 20 === 0) {
                console.log(`[ZC-TRACE] 20 flee.canUse result=${isFleeing}`)
            }
            return isFleeing
        },
        entity => { // canContinueToUse — keep fleeing while flag is set
            let isFleeing = global.zombieCrowGetFleeState(entity)
            if (entity.age % 20 === 0) {
                console.log(`[ZC-TRACE] 21 flee.canContinue result=${isFleeing}`)
            }
            return isFleeing
        },
        true, // isInterruptable
        entity => { // goalOnStartedEvent. this runs once when the goal starts
            console.log(`[ZC-TRACE] 22 flee.onStart uuid=${entity.uuid} age=${entity.age}`)
            global.zombieCrowStartFlee(entity)
        },
        entity => { console.log(`[ZC-TRACE] 23 flee.onEnd uuid=${entity.uuid} age=${entity.age}`) }, // goalOnEndedEvent. this runs once when the goal ends
        true, // requiresUpdateEveryTick
        entity => { // goalOnTickEvent. this runs once every tick while the goal is running
            if (entity.age % 20 === 0) {
                console.log(`[ZC-TRACE] 24 flee.onTick age=${entity.age}`)
            }
            global.zombieCrowRunFleeTick(entity)
        }
    )
})

EntityJSEvents.addGoals('frontiers:zombie_crow', event => { // target selectors
    event.ownerHurtByTarget(0)
    event.hurtByTarget(1, [], true, [])
})

BlockEvents.broken('frontiers:zombie_crow_egg', event => {
    global.zombieCrowEggBroken(event)
})

global.zombieCrowEggBroken = event => {
    console.log(`[ZC-TRACE] 1 zombieCrowEggBroken start`)
    let level = event.level
    let block = event.block
    let blockPos = block.pos
    console.log(`[ZC-TRACE] 2 egg broken at ${blockPos.x},${blockPos.y},${blockPos.z}`)

    let currentHealth = Number(block.properties.current_health)
    let currentPhase = Number(block.properties.current_phase)
    console.log(`[ZC-TRACE] 3 raw block props current_health=${block.properties.current_health} current_phase=${block.properties.current_phase}`)

    if (!Number.isFinite(currentHealth)) {
        console.log(`[ZC-TRACE] 4 invalid current_health, defaulting to 40`)
        currentHealth = 40
    }
    if (!Number.isFinite(currentPhase)) {
        console.log(`[ZC-TRACE] 5 invalid current_phase, defaulting to 0`)
        currentPhase = 0
    }

    currentHealth = Math.max(0, Math.min(ZOMBIE_CROW_EGG_MAX_HEALTH, Math.floor(currentHealth)))
    currentPhase = Math.max(0, Math.min(ZOMBIE_CROW_EGG_MAX_PHASE, Math.floor(currentPhase)))
    console.log(`[ZC-TRACE] 6 clamped values currentHealth=${currentHealth} currentPhase=${currentPhase}`)

    for (let step = 0; step <= 15; step++) {
        let particleY = blockPos.y + step
        level.server.scheduleInTicks(step, () => {
            level.spawnParticles('call_of_yucutan:rain_wisp', true, blockPos.x + 0.5, particleY + 0.5, blockPos.z + 0.5, 0, 0, 0, 1, 0)
        })
    }
    console.log(`[ZC-TRACE] 7 scheduled 16 beam particle steps`)

    let respawnedCrow = level.createEntity('frontiers:zombie_crow')
    if (!respawnedCrow) {
        console.log(`[ZC-TRACE] 8 FAILED createEntity(frontiers:zombie_crow)`)
        return
    }
    console.log(`[ZC-TRACE] 9 created new zombie crow entity`)
    respawnedCrow.setPosition(blockPos.x + 0.5, blockPos.y + 15, blockPos.z + 0.5)
    respawnedCrow.setNoGravity(true)
    respawnedCrow.setSyncedData('isFleeing', false)
    respawnedCrow.setSyncedData('currentPhase', currentPhase + 1)
    respawnedCrow.setSyncedData('orbitalDestinationIndex', 0)
    console.log(`[ZC-TRACE] 10 pre-spawn syncedData isFleeing=false currentPhase=${currentPhase + 1} orbitalDestinationIndex=0`)
    respawnedCrow.spawn()
    console.log(`[ZC-TRACE] 11 respawned crow spawned at ${blockPos.x + 0.5},${blockPos.y + 15},${blockPos.z + 0.5}`)

    let maxHealth = respawnedCrow.getMaxHealth()
    let respawnHealth = Math.max(1, Math.min(maxHealth, currentHealth))
    respawnedCrow.setHealth(respawnHealth)
    console.log(`[ZC-TRACE] 12 applied respawnHealth=${respawnHealth} maxHealth=${maxHealth}`)

    console.log(`[ZC-TRACE] 13 zombieCrowEggBroken complete phaseFromEgg=${currentPhase} phaseAfterRespawn=${currentPhase + 1}`)
}

global.zombieCrowRunFleeTick = entity => {
    try {
        if (!(entity.level === 'ClientLevel')) {
            if (entity.age % 20 === 0) {
                console.log(`[ZC-TRACE] 25 runFleeTick server age=${entity.age} uuid=${entity.uuid}`)
            }
            let level = entity.level
            let targetX = entity.getSyncedData('ownerBlockLocationX')
            let targetY = entity.getSyncedData('ownerBlockLocationY')
            let targetZ = entity.getSyncedData('ownerBlockLocationZ')
            if (Math.abs(entity.x - targetX) < 1 && Math.abs(entity.z - targetZ) < 1) {
                console.log(`[ZC-TRACE] 26 runFleeTick reached targetX/targetZ target=${targetX},${targetZ} entity=${entity.x},${entity.z}`)
                let start = entity.getEyePosition()
                let end = start.add(0, -99, 0)
                let result = level.clip(new ClipContext(start, end, ClipContext.Block.COLLIDER, ClipContext.Fluid.NONE, entity))
                if (result.getType() === HitResult.Type.BLOCK) {
                    console.log(`[ZC-TRACE] 27 runFleeTick clip hit block placing egg`)
                    let hit = result.getBlockPos()
                    let currentHealth = Math.max(0, Math.min(ZOMBIE_CROW_EGG_MAX_HEALTH, Math.floor(entity.getHealth())))
                    let currentPhase = Math.max(0, Math.min(ZOMBIE_CROW_EGG_MAX_PHASE, Number(entity.getSyncedData('currentPhase')) || 0))
                    Utils.server.runCommandSilent(`execute in ${entity.level.getDimension()} run setblock ${hit.x} ${hit.y + 1} ${hit.z} frontiers:zombie_crow_egg[current_health=${currentHealth},current_phase=${currentPhase}]`)
                    console.log(`[ZC-TRACE] 28 setblock egg with current_health=${currentHealth} current_phase=${currentPhase}`)

                    try {
                        let block = level.getBlock(new BlockPos(hit.x, hit.y + 1, hit.z))
                        console.log(`placed block properties=${block.properties}`)


                    } catch (err) {
                        console.error(`error reading placed block: ${err}`)
                    }

                    let steps = Math.floor(entity.y - hit.y)
                    for (let step = 0; step <= steps; step++) {
                        let particleY = entity.y - step
                        level.server.scheduleInTicks(step, () => { level.spawnParticles("call_of_yucutan:rain_wisp", true, entity.x, particleY, entity.z, 0, 0, 0, 1, 0) })
                    }
                    console.log(`[ZC-TRACE] 29 runFleeTick removing entity after egg placement`)
                    entity.remove('DISCARDED')
                }
            }

            let start = entity.getEyePosition()
            let end = start.add(0, -15, 0)
            let result = level.clip(new ClipContext(start, end, ClipContext.Block.COLLIDER, ClipContext.Fluid.NONE, entity))
            let blockBelow = result.getType() === HitResult.Type.BLOCK
            let desiredY = targetY

            if (!blockBelow) {
                if (desiredY > entity.y) {
                    desiredY = entity.y
                }
            } else {
                if (desiredY < entity.y) {
                    desiredY = entity.y
                }
            }

            let clampedY = global.clampY(desiredY, entity.y - 3, entity.y + 3)
            if (entity.isInWater()) {
                entity.getLookControl().setLookAt(targetX, clampedY, targetZ); entity.getNavigation().moveTo(targetX, clampedY, targetZ, 10)
            } else {
                entity.lookAt("eyes", new Vec3d(targetX, clampedY, targetZ))
                entity.getNavigation().moveTo(targetX, clampedY, targetZ, 1)
                global.applyVerticalSteering(entity, clampedY, 0.15, 0.2)
            }
        }
    } catch (err) {
        console.log(`[ZC-TRACE] 30 runFleeTick exception=${err}`)
    }
}

global.zombieCrowRunFight = entity => {
    if (entity.level === 'ClientLevel') {
        if (entity.age % 20 === 0) {
            console.log(`[ZC-TRACE] 31 runFight skipped on client level age=${entity.age}`)
        }
        return
    }

    if (entity.age % 20 === 0) {
        console.log(`[ZC-TRACE] 32 runFight server tick age=${entity.age} uuid=${entity.uuid}`)
    }

    // --- Health-check: switch to flee at 1/3 health lost ---
    let maxHealth = entity.getMaxHealth()
    let currentPhaseRaw = entity.getSyncedData('currentPhase')
    let currentPhase = Number(currentPhaseRaw)
    if (!Number.isFinite(currentPhase)) {
        currentPhase = 0
    }
    currentPhase = Math.max(0, Math.floor(currentPhase))

    let fleeThreshold = -1
    if (currentPhase === 0) {
        fleeThreshold = maxHealth * (2 / 3)
    } else if (currentPhase === 1) {
        fleeThreshold = maxHealth * (1 / 3)
    }

    if (entity.age % 20 === 0) {
        console.log(`[ZC-TRACE] 33 runFight health=${entity.getHealth()} maxHealth=${maxHealth} currentPhaseRaw=${currentPhaseRaw} currentPhase=${currentPhase} fleeThreshold=${fleeThreshold}`)
    }
    if (fleeThreshold >= 0 && entity.getHealth() <= fleeThreshold) {
        console.log(`[ZC-TRACE] 34 runFight switching to flee because health threshold met`)
        entity.setSyncedData('isFleeing', true)
        console.log(`[ZC-TRACE] 35 runFight wrote isFleeing raw=${entity.getSyncedData('isFleeing')}`)
        return
    }

    if (entity.age % 20 === 0 && currentPhase >= 2) {
        console.log(`[ZC-TRACE] 47 runFight phase=${currentPhase} so flee is disabled`)
    }

    // --- Orbit + attack logic (moved from startup runZombieCrowTick) ---
    let ORBIT_RADIUS = 10

    let nearestPlayer = entity.level.getNearestPlayer(entity, 128)
    if (!nearestPlayer) {
        if (entity.age % 20 === 0) {
            console.log(`[ZC-TRACE] 36 runFight no nearest player found`)
        }
        return
    }
    if (entity.age % 20 === 0) {
        console.log(`[ZC-TRACE] 37 runFight nearestPlayer=${nearestPlayer.name ? nearestPlayer.name.string : 'unknown'}`)
    }

    let pointIndex = entity.getSyncedData('orbitalDestinationIndex')

    // Debug particles for each of the 8 orbital waypoints
    for (let index = 0; index < 8; index++) {
        let waypointAngle = (index % 8) * (JavaMath.PI / 4)
        let waypointX = nearestPlayer.x + Math.cos(waypointAngle) * ORBIT_RADIUS
        let waypointY = entity.y
        let waypointZ = nearestPlayer.z + Math.sin(waypointAngle) * ORBIT_RADIUS
        if (pointIndex === index) {
            entity.level.spawnParticles('minecraft:lava', false, waypointX, waypointY, waypointZ, 0, 0, 0, 1, 0)
        } else {
            entity.level.spawnParticles('call_of_yucutan:rain_wisp', true, waypointX, waypointY, waypointZ, 0, 0, 0, 1, 0)
        }
    }

    // Move toward current waypoint
    let currentAngle = (pointIndex % 8) * (JavaMath.PI / 4)
    let targetX = nearestPlayer.x + Math.cos(currentAngle) * ORBIT_RADIUS
    let targetY = entity.y
    let targetZ = nearestPlayer.z + Math.sin(currentAngle) * ORBIT_RADIUS

    let entityX = entity.x
    let entityZ = entity.z

    if (entityX > targetX - 1 && entityX < targetX + 1 && entityZ > targetZ - 1 && entityZ < targetZ + 1) {
        if (pointIndex >= 7) {
            entity.setSyncedData('orbitalDestinationIndex', 0)
        } else {
            entity.setSyncedData('orbitalDestinationIndex', pointIndex + 1)
        }
    }

    entity.lookAt("eyes", new Vec3d(targetX, targetY, targetZ))
    entity.getNavigation().moveTo(targetX, targetY, targetZ, 1)

    // Fire projectile every 80 ticks
    if (entity.age % 80 === 0) {
        console.log(`[ZC-TRACE] 38 runFight firing projectile`)
        global.spawnZombieCrowProjectile(entity, nearestPlayer)
    }

    // Left-side smoke debug particles
    try {
        let attackingPos = entity.eyePosition
        let defendingPos = nearestPlayer.eyePosition
        if (!attackingPos || !defendingPos) {
            return
        }
        let attackAngle = global.angleVecFromAToB(attackingPos, defendingPos)
        let length = Math.sqrt(attackAngle.x() * attackAngle.x() + attackAngle.z() * attackAngle.z())
        if (length === 0) {
            return
        }
        let smokeMatrix = [
            [0, 0, 1, 0, 0],
            [0, 1, 0, 1, 0],
            [1, 0, 1, 0, 1],
            [0, 1, 0, 1, 0],
            [0, 0, 1, 0, 0]
        ]
        let smokeSpacing = 3
        global.spawnZombieCrowDebugSmoke(entity.level, defendingPos, attackAngle, smokeMatrix, smokeSpacing)
    } catch (err) {
        console.error(`[ZC-TRACE] 39 runFight particle exception=${err}`)
    }
}

global.zombieCrowStartFlee = entity => {
    let level = entity.level
    console.log(`[ZC-TRACE] 40 startFlee invoked uuid=${entity.uuid}`)
    let foundDestination = false
    for (let tries = 0; tries < 10; tries++) {
        let randomAngleFromBait = getRandomIntInclusive(0, 360)
        let angle = randomAngleFromBait * JavaMath.PI * 2 / 360
        let locationX = entity.x + 0.5 + Math.cos(angle) * 50
        let locationZ = entity.z + 0.5 + Math.sin(angle) * 50
        let targetDestination = new Vec3d(locationX, entity.y, locationZ)
        let start = entity.getEyePosition()
        let clipContext = new ClipContext(start, targetDestination, ClipContext.Block.COLLIDER, ClipContext.Fluid.NONE, entity)
        let result = level.clip(clipContext)
        if (result.getType() !== HitResult.Type.BLOCK) {
            let blockX = Math.floor(locationX), blockY = Math.floor(entity.y), blockZ = Math.floor(locationZ)
            while (level.getBlock(blockX, blockY + 1, blockZ).id != "minecraft:air") { blockY++ }
            while (blockY > 0 && level.getBlock(blockX, blockY, blockZ).id == "minecraft:air") { blockY-- }
            let newYValue = blockY + 15
            entity.setSyncedData('ownerBlockLocationX', locationX)
            entity.setSyncedData('ownerBlockLocationY', newYValue)
            entity.setSyncedData('ownerBlockLocationZ', locationZ)
            foundDestination = true
            break
        }
    }
    if (!foundDestination) {
        console.log(`startFlee failed to find any valid destination`)
    }
}

global.clampY = (y, minY, maxY) => {
    if (y < minY) {
        return minY
    } else if (y > maxY) {
        return maxY
    }
    return y
}

global.applyVerticalSteering = (entity, targetY, strength, maxSpeed) => {
    if (!entity || !entity.isAlive()) {
        return
    }

    let dy = targetY - entity.y
    if (Math.abs(dy) < 0.05) {
        return
    }

    let motion = entity.getDeltaMovement()
    let yVel = Math.max(-maxSpeed, Math.min(maxSpeed, dy * strength))

    entity.setMotion(motion.x(), yVel, motion.z())
}