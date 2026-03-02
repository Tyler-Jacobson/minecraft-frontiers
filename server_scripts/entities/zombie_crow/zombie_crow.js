let LivingEntity = Java.loadClass('net.minecraft.world.entity.LivingEntity')
let CustomGoal = Java.loadClass("net.liopyu.entityjs.util.ai.CustomGoal")
let $MoveGoalFlag = Java.loadClass("net.minecraft.world.entity.ai.goal.Goal$Flag")
let DefaultRandomPos = Java.loadClass("net.minecraft.world.entity.ai.util.DefaultRandomPos")
let ClipContext = Java.loadClass('net.minecraft.world.level.ClipContext')
let HitResult = Java.loadClass('net.minecraft.world.phys.HitResult')
let CompoundTag = Java.loadClass('net.minecraft.nbt.CompoundTag')

const ZOMBIE_CROW_EGG_MAX_HEALTH = 200
const ZOMBIE_CROW_EGG_MAX_PHASE = 3
const ZOMBIE_CROW_ORBIT_MOVE_SPEED = 0.2
const ZOMBIE_CROW_FLEE_MOVE_SPEED = 0.7
const ZOMBIE_CROW_ATTACK_MATRICES = [
    [
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, -1, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0]
    ],
    [
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 5, 0, -1, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0]
    ],
    [
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 5, 10, -1, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0]
    ]
]

global.zombieCrowGetFleeState = entity => {
    let rawIsFleeingValue = entity.getSyncedData('isFleeing')
    let fleeStateFromStrictBoolean = rawIsFleeingValue === true
    let normalizedFleeState = fleeStateFromStrictBoolean
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
            if (cellValue === 0) {
                continue
            }

            let forwardFactor = 2 - rowIndex
            let sideFactor = 2 - columnIndex

            let smokeX = defendingPos.x() + (forwardX * forwardFactor * spacing) + (leftX * sideFactor * spacing)
            let smokeZ = defendingPos.z() + (forwardZ * forwardFactor * spacing) + (leftZ * sideFactor * spacing)

            // level.spawnParticles('minecraft:smoke', false, smokeX, smokeY, smokeZ, 0, 0, 0, 10, 0.1)
        }
    }
}

EntityJSEvents.addGoalSelectors('frontiers:zombie_crow', event => { // goal selectors
    event.customGoal(
        "fight",
        1,
        entity => { // canUse — fight while not fleeing
            let isFleeing = global.zombieCrowGetFleeState(entity)
            return !isFleeing
        },
        entity => { // canContinueToUse — keep fighting while not fleeing
            let isFleeing = global.zombieCrowGetFleeState(entity)
            return !isFleeing
        },
        false, // isInterruptable
        entity => { }, // goalOnStartedEvent. this runs once when the goal starts
        entity => { }, // goalOnEndedEvent. this runs once when the goal ends
        true, // requiresUpdateEveryTick
        entity => { // goalOnTickEvent. this runs once every tick while the goal is running
            global.zombieCrowRunFight(entity)
        }
    )
    event.customGoal(
        "flee",
        2,
        entity => { // canUse — flee when isFleeing is set
            let isFleeing = global.zombieCrowGetFleeState(entity)
            return isFleeing
        },
        entity => { // canContinueToUse — keep fleeing while flag is set
            let isFleeing = global.zombieCrowGetFleeState(entity)
            return isFleeing
        },
        true, // isInterruptable
        entity => { // goalOnStartedEvent. this runs once when the goal starts
            global.zombieCrowStartFlee(entity)
        },
        entity => { }, // goalOnEndedEvent. this runs once when the goal ends
        true, // requiresUpdateEveryTick
        entity => { // goalOnTickEvent. this runs once every tick while the goal is running
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
    let level = event.level
    let block = event.block
    let blockPos = block.pos

    let currentHealth = Number(block.properties.current_health)
    let currentPhase = Number(block.properties.current_phase)

    if (!Number.isFinite(currentHealth)) {
        currentHealth = 40
    }
    if (!Number.isFinite(currentPhase)) {
        currentPhase = 0
    }

    currentHealth = Math.max(0, Math.min(ZOMBIE_CROW_EGG_MAX_HEALTH, Math.floor(currentHealth)))
    currentPhase = Math.max(0, Math.min(ZOMBIE_CROW_EGG_MAX_PHASE, Math.floor(currentPhase)))

    for (let step = 0; step <= 15; step++) {
        let particleY = blockPos.y + step
        level.server.scheduleInTicks(step, () => {
            level.spawnParticles('call_of_yucutan:rain_wisp', true, blockPos.x + 0.5, particleY + 0.5, blockPos.z + 0.5, 0, 0, 0, 1, 0)
        })
    }
    let respawnedCrow = level.createEntity('frontiers:zombie_crow')
    if (!respawnedCrow) {
        return
    }
    respawnedCrow.setPosition(blockPos.x + 0.5, blockPos.y + 15, blockPos.z + 0.5)
    respawnedCrow.setNoGravity(true)
    respawnedCrow.setSyncedData('isFleeing', false)
    respawnedCrow.setSyncedData('currentPhase', currentPhase + 1)
    respawnedCrow.setSyncedData('orbitalDestinationIndex', 0)
    respawnedCrow.spawn()

    let maxHealth = respawnedCrow.getMaxHealth()
    let respawnHealth = Math.max(1, Math.min(maxHealth, currentHealth))
    respawnedCrow.setHealth(respawnHealth)
}

global.zombieCrowRunFleeTick = entity => {
    try {
        if (!(entity.level === 'ClientLevel')) {
            let level = entity.level
            let targetX = entity.getSyncedData('ownerBlockLocationX')
            let targetY = entity.getSyncedData('ownerBlockLocationY')
            let targetZ = entity.getSyncedData('ownerBlockLocationZ')
            if (Math.abs(entity.x - targetX) < 1 && Math.abs(entity.z - targetZ) < 1) {
                let start = entity.getEyePosition()
                let end = start.add(0, -99, 0)
                let result = level.clip(new ClipContext(start, end, ClipContext.Block.COLLIDER, ClipContext.Fluid.NONE, entity))
                if (result.getType() === HitResult.Type.BLOCK) {
                    let hit = result.getBlockPos()
                    let currentHealth = Math.max(0, Math.min(ZOMBIE_CROW_EGG_MAX_HEALTH, Math.floor(entity.getHealth())))
                    let currentPhase = Math.max(0, Math.min(ZOMBIE_CROW_EGG_MAX_PHASE, Number(entity.getSyncedData('currentPhase')) || 0))
                    Utils.server.runCommandSilent(`execute in ${entity.level.getDimension()} run setblock ${hit.x} ${hit.y + 1} ${hit.z} frontiers:zombie_crow_egg[current_health=${currentHealth},current_phase=${currentPhase}]`)

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
                entity.getLookControl().setLookAt(targetX, clampedY, targetZ); entity.getNavigation().moveTo(targetX, clampedY, targetZ, ZOMBIE_CROW_FLEE_MOVE_SPEED)
                global.applyHorizontalSteering(entity, targetX, targetZ, ZOMBIE_CROW_FLEE_MOVE_SPEED)
            } else {
                entity.lookAt("eyes", new Vec3d(targetX, clampedY, targetZ))
                entity.getNavigation().moveTo(targetX, clampedY, targetZ, ZOMBIE_CROW_FLEE_MOVE_SPEED)
                global.applyHorizontalSteering(entity, targetX, targetZ, ZOMBIE_CROW_FLEE_MOVE_SPEED)
                global.applyVerticalSteering(entity, clampedY, 0.15, 0.2)
            }
        }
    } catch (err) {
    }
}

global.zombieCrowRunFight = entity => {
    if (entity.level === 'ClientLevel') {
        return
    }

    // --- Health-check: switch to flee at 1/3 health lost ---
    let maxHealth = entity.getMaxHealth()
    let currentPhaseRaw = entity.getSyncedData('currentPhase')
    let currentPhase = Number(currentPhaseRaw)
    if (!Number.isFinite(currentPhase)) {
        currentPhase = 0
    }
    currentPhase = Math.max(0, Math.floor(currentPhase))
    let attackMatrixIndex = Math.max(0, Math.min(2, currentPhase))
    let selectedAttackMatrix = ZOMBIE_CROW_ATTACK_MATRICES[attackMatrixIndex]

    let fleeThreshold = -1
    if (currentPhase === 0) {
        fleeThreshold = maxHealth * (2 / 3)
    } else if (currentPhase === 1) {
        fleeThreshold = maxHealth * (1 / 3)
    }

    if (fleeThreshold >= 0 && entity.getHealth() <= fleeThreshold) {
        entity.setSyncedData('isFleeing', true)
        return
    }

    // --- Orbit + attack logic (moved from startup runZombieCrowTick) ---
    let ORBIT_RADIUS = 10

    let nearestPlayer = entity.level.getNearestPlayer(entity, 128)
    if (!nearestPlayer) {
        return
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
    entity.getNavigation().moveTo(targetX, targetY, targetZ, ZOMBIE_CROW_ORBIT_MOVE_SPEED)
    global.applyHorizontalSteering(entity, targetX, targetZ, ZOMBIE_CROW_ORBIT_MOVE_SPEED)

    // Fire projectile every 80 ticks
    if (entity.age % 80 === 0) {
        let attackingPos = entity.eyePosition
        let defendingPos = nearestPlayer.eyePosition
        if (attackingPos && defendingPos) {
            let attackAngle = global.angleVecFromAToB(attackingPos, defendingPos)
            let horizontalLength = Math.sqrt(attackAngle.x() * attackAngle.x() + attackAngle.z() * attackAngle.z())
            if (horizontalLength !== 0) {
                let forwardX = attackAngle.x() / horizontalLength
                let forwardZ = attackAngle.z() / horizontalLength
                let leftX = -forwardZ
                let leftZ = forwardX
                let fightLevel = entity.level
                let firingCrowUuid = `${entity.uuid}`

                let attackMatrixSpacing = 3

                for (let rowIndex = 0; rowIndex < 5; rowIndex++) {
                    let row = selectedAttackMatrix[rowIndex]
                    if (!row) {
                        continue
                    }
                    for (let columnIndex = 0; columnIndex < 5; columnIndex++) {
                        let cellValue = Number(row[columnIndex])
                        if (cellValue === 0) {
                            continue
                        }

                        let forwardFactor = 2 - rowIndex
                        let sideFactor = 2 - columnIndex

                        let targetMatrixX = defendingPos.x() + (forwardX * forwardFactor * attackMatrixSpacing) + (leftX * sideFactor * attackMatrixSpacing)
                        let targetMatrixY = defendingPos.y()
                        let targetMatrixZ = defendingPos.z() + (forwardZ * forwardFactor * attackMatrixSpacing) + (leftZ * sideFactor * attackMatrixSpacing)
                        if (cellValue === -1) {
                            global.spawnZombieCrowProjectile(entity, targetMatrixX, targetMatrixY, targetMatrixZ)
                        } else if (cellValue > 0) {
                            let tickDelay = Math.max(1, Math.floor(cellValue))
                            Utils.server.scheduleInTicks(tickDelay, () => {
                                let firingCrow = fightLevel.getEntity(firingCrowUuid)
                                if (!firingCrow || !firingCrow.isAlive()) {
                                    return
                                }
                                global.spawnZombieCrowProjectile(firingCrow, targetMatrixX, targetMatrixY, targetMatrixZ)
                            })
                        }
                    }
                }
            }
        }
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
        let smokeSpacing = 3
        global.spawnZombieCrowDebugSmoke(entity.level, defendingPos, attackAngle, selectedAttackMatrix, smokeSpacing)
    } catch (err) {
    }
}

global.zombieCrowStartFlee = entity => {
    let level = entity.level
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

global.applyHorizontalSteering = (entity, targetX, targetZ, horizontalSpeed) => {
    if (!entity || !entity.isAlive()) {
        return
    }

    let speedValue = Number(horizontalSpeed)
    if (!Number.isFinite(speedValue) || speedValue <= 0) {
        return
    }

    let deltaX = targetX - entity.x
    let deltaZ = targetZ - entity.z
    let horizontalDistance = Math.sqrt((deltaX * deltaX) + (deltaZ * deltaZ))
    if (horizontalDistance < 0.001) {
        return
    }

    let directionX = deltaX / horizontalDistance
    let directionZ = deltaZ / horizontalDistance
    let motion = entity.getDeltaMovement()

    entity.setMotion(directionX * speedValue, motion.y(), directionZ * speedValue)
}