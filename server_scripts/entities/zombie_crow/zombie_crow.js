let LivingEntity = Java.loadClass('net.minecraft.world.entity.LivingEntity')
let CustomGoal = Java.loadClass("net.liopyu.entityjs.util.ai.CustomGoal")
let $MoveGoalFlag = Java.loadClass("net.minecraft.world.entity.ai.goal.Goal$Flag")
let DefaultRandomPos = Java.loadClass("net.minecraft.world.entity.ai.util.DefaultRandomPos")
let ClipContext = Java.loadClass('net.minecraft.world.level.ClipContext')
let HitResult = Java.loadClass('net.minecraft.world.phys.HitResult')
let CompoundTag = Java.loadClass('net.minecraft.nbt.CompoundTag')

const ZOMBIE_CROW_TRACE_PREFIX = '[ZC-TRACE]'

EntityJSEvents.addGoalSelectors('frontiers:zombie_crow', event => { // goal selectors
    console.log(`${ZOMBIE_CROW_TRACE_PREFIX} 1 addGoalSelectors registration start`)
    event.customGoal(
        "fight",
        1,
        entity => { // canUse — fight while not fleeing
            let isFleeing = entity.getSyncedData('isFleeing')
            let isFleeingValue = Number(isFleeing)
            let canUseFightGoal = isFleeingValue === 0
            if (entity.age % 20 === 0) {
                console.log(`${ZOMBIE_CROW_TRACE_PREFIX} 2 fight.canUse=${canUseFightGoal} isFleeingRaw=${isFleeing} isFleeingValue=${isFleeingValue} age=${entity.age}`)
            }
            return canUseFightGoal
        },
        entity => { // canContinueToUse — keep fighting while not fleeing
            let isFleeing = entity.getSyncedData('isFleeing')
            let isFleeingValue = Number(isFleeing)
            let canContinueFightGoal = isFleeingValue === 0
            if (entity.age % 20 === 0) {
                console.log(`${ZOMBIE_CROW_TRACE_PREFIX} 3 fight.canContinue=${canContinueFightGoal} isFleeingRaw=${isFleeing} isFleeingValue=${isFleeingValue} age=${entity.age}`)
            }
            return canContinueFightGoal
        },
        false, // isInterruptable
        entity => { console.log(`${ZOMBIE_CROW_TRACE_PREFIX} 4 fight.onStart uuid=${entity.uuid}`) }, // goalOnStartedEvent. this runs once when the goal starts
        entity => { console.log(`${ZOMBIE_CROW_TRACE_PREFIX} 5 fight.onEnd uuid=${entity.uuid}`) }, // goalOnEndedEvent. this runs once when the goal ends
        true, // requiresUpdateEveryTick
        entity => { // goalOnTickEvent. this runs once every tick while the goal is running
            if (entity.age % 20 === 0) {
                console.log(`${ZOMBIE_CROW_TRACE_PREFIX} 6 fight.onTick age=${entity.age}`)
            }
            global.zombieCrowRunFight(entity)
        }
    )
    event.customGoal(
        "flee",
        2,
        entity => { // canUse — flee when isFleeing is set
            let isFleeing = entity.getSyncedData('isFleeing')
            let isFleeingValue = Number(isFleeing)
            let canUseFleeGoal = isFleeingValue === 1
            if (entity.age % 20 === 0) {
                console.log(`${ZOMBIE_CROW_TRACE_PREFIX} 7 flee.canUse=${canUseFleeGoal} isFleeingRaw=${isFleeing} isFleeingValue=${isFleeingValue} age=${entity.age}`)
            }
            return canUseFleeGoal
        },
        entity => { // canContinueToUse — keep fleeing while flag is set
            let isFleeing = entity.getSyncedData('isFleeing')
            let isFleeingValue = Number(isFleeing)
            let canContinueFleeGoal = isFleeingValue === 1
            if (entity.age % 20 === 0) {
                console.log(`${ZOMBIE_CROW_TRACE_PREFIX} 8 flee.canContinue=${canContinueFleeGoal} isFleeingRaw=${isFleeing} isFleeingValue=${isFleeingValue} age=${entity.age}`)
            }
            return canContinueFleeGoal
        },
        true, // isInterruptable
        entity => { // goalOnStartedEvent. this runs once when the goal starts
            console.log(`${ZOMBIE_CROW_TRACE_PREFIX} 9 flee.onStart uuid=${entity.uuid}`)
            global.zombieCrowStartFlee(entity)
        },
        entity => { console.log(`${ZOMBIE_CROW_TRACE_PREFIX} 10 flee.onEnd uuid=${entity.uuid}`) }, // goalOnEndedEvent. this runs once when the goal ends
        true, // requiresUpdateEveryTick
        entity => { // goalOnTickEvent. this runs once every tick while the goal is running
            if (entity.age % 20 === 0) {
                console.log(`${ZOMBIE_CROW_TRACE_PREFIX} 11 flee.onTick age=${entity.age}`)
            }
            global.zombieCrowRunFleeTick(entity)
        }
    )

    registerCustomGoalFlag(event, 'CustomGoal[fight]', $MoveGoalFlag.MOVE)
    registerCustomGoalFlag(event, 'CustomGoal[fight]', $MoveGoalFlag.JUMP)
    registerCustomGoalFlag(event, 'CustomGoal[fight]', $MoveGoalFlag.LOOK)

    registerCustomGoalFlag(event, 'CustomGoal[flee]', $MoveGoalFlag.MOVE)
    registerCustomGoalFlag(event, 'CustomGoal[flee]', $MoveGoalFlag.JUMP)
    registerCustomGoalFlag(event, 'CustomGoal[flee]', $MoveGoalFlag.LOOK)

    console.log(`${ZOMBIE_CROW_TRACE_PREFIX} 12 addGoalSelectors registration complete`)
    logRegisteredGoals(event)
})

EntityJSEvents.addGoals('frontiers:zombie_crow', event => { // target selectors
    console.log(`${ZOMBIE_CROW_TRACE_PREFIX} 13 addGoals registration start`)
    event.ownerHurtByTarget(0)
    event.hurtByTarget(1, [], true, [])
    console.log(`${ZOMBIE_CROW_TRACE_PREFIX} 14 addGoals registration complete`)
})

global.zombieCrowRunFleeTick = entity => {
    try {
        if (entity.age % 20 === 0) {
            console.log(`${ZOMBIE_CROW_TRACE_PREFIX} 15 runFleeTick entry age=${entity.age} uuid=${entity.uuid}`)
        }
        if (!(entity.level === 'ClientLevel')) {
            let level = entity.level
            let targetX = entity.getSyncedData('ownerBlockLocationX')
            let targetY = entity.getSyncedData('ownerBlockLocationY')
            let targetZ = entity.getSyncedData('ownerBlockLocationZ')
            if (entity.age % 20 === 0) {
                console.log(`${ZOMBIE_CROW_TRACE_PREFIX} 16 flee targetXYZ=${targetX},${targetY},${targetZ} entityXYZ=${entity.x},${entity.y},${entity.z}`)
            }
            if (Math.abs(entity.x - targetX) < 1 && Math.abs(entity.z - targetZ) < 1) {
                console.log(`${ZOMBIE_CROW_TRACE_PREFIX} 17 flee reached target XZ, preparing egg placement`)
                let start = entity.getEyePosition()
                let end = start.add(0, -99, 0)
                let result = level.clip(new ClipContext(start, end, ClipContext.Block.COLLIDER, ClipContext.Fluid.NONE, entity))
                if (result.getType() === HitResult.Type.BLOCK) {
                    console.log(`${ZOMBIE_CROW_TRACE_PREFIX} 18 flee downward clip hit block, placing egg`)
                    let hit = result.getBlockPos()
                    Utils.server.runCommandSilent(`execute in ${entity.level.getDimension()} run setblock ${hit.x} ${hit.y + 1} ${hit.z} frontiers:zombie_crow_egg[current_health=3]`)
                    console.log(`${ZOMBIE_CROW_TRACE_PREFIX} 19 setblock issued at ${hit.x},${hit.y + 1},${hit.z}`)

                    try {
                        let block = level.getBlock(new BlockPos(hit.x, hit.y + 1, hit.z))
                        console.log(`${ZOMBIE_CROW_TRACE_PREFIX} 20 placed block properties=${block.properties}`)


                    } catch (err) {
                        console.error(`${ZOMBIE_CROW_TRACE_PREFIX} 21 error reading placed block: ${err}`)
                    }

                    let steps = Math.floor(entity.y - hit.y)
                    console.log(`${ZOMBIE_CROW_TRACE_PREFIX} 22 spawning particle line steps=${steps}`)
                    for (let step = 0; step <= steps; step++) {
                        let particleY = entity.y - step
                        level.server.scheduleInTicks(step, () => { level.spawnParticles("call_of_yucutan:rain_wisp", true, entity.x, particleY, entity.z, 0, 0, 0, 1, 0) })
                    }
                    console.log(`${ZOMBIE_CROW_TRACE_PREFIX} 23 removing zombie crow after egg placement`)
                    entity.remove('DISCARDED')
                } else {
                    console.log(`${ZOMBIE_CROW_TRACE_PREFIX} 24 flee downward clip missed block type=${result.getType()}`)
                }
            } else if (entity.age % 20 === 0) {
                console.log(`${ZOMBIE_CROW_TRACE_PREFIX} 25 flee not yet at target XZ`)
            }

            let start = entity.getEyePosition()
            let end = start.add(0, -15, 0)
            let result = level.clip(new ClipContext(start, end, ClipContext.Block.COLLIDER, ClipContext.Fluid.NONE, entity))
            let blockBelow = result.getType() === HitResult.Type.BLOCK
            let desiredY = targetY
            if (entity.age % 20 === 0) {
                console.log(`${ZOMBIE_CROW_TRACE_PREFIX} 26 flee blockBelow=${blockBelow} desiredYStart=${desiredY}`)
            }

            if (!blockBelow) {
                if (desiredY > entity.y) {
                    desiredY = entity.y
                    console.log(`${ZOMBIE_CROW_TRACE_PREFIX} 27 no block below, clamped desiredY down to entity.y=${entity.y}`)
                }
            } else {
                if (desiredY < entity.y) {
                    desiredY = entity.y
                    console.log(`${ZOMBIE_CROW_TRACE_PREFIX} 28 block below, clamped desiredY up to entity.y=${entity.y}`)
                }
            }

            let clampedY = global.clampY(desiredY, entity.y - 3, entity.y + 3)
            if (entity.age % 20 === 0) {
                console.log(`${ZOMBIE_CROW_TRACE_PREFIX} 29 flee clampedY=${clampedY}`)
            }
            if (entity.isInWater()) {
                console.log(`${ZOMBIE_CROW_TRACE_PREFIX} 30 flee in water, using lookControl + moveTo speed=10`)
                entity.getLookControl().setLookAt(targetX, clampedY, targetZ); entity.getNavigation().moveTo(targetX, clampedY, targetZ, 10)
            } else {
                if (entity.age % 20 === 0) {
                    console.log(`${ZOMBIE_CROW_TRACE_PREFIX} 31 flee not in water, using lookAt + moveTo speed=1`)
                }
                entity.lookAt("eyes", new Vec3d(targetX, clampedY, targetZ))
                entity.getNavigation().moveTo(targetX, clampedY, targetZ, 1)
                global.applyVerticalSteering(entity, clampedY, 0.15, 0.2)
            }
        } else if (entity.age % 20 === 0) {
            console.log(`${ZOMBIE_CROW_TRACE_PREFIX} 32 runFleeTick on client level, skipping`)
        }
    } catch (err) {
        console.log(`${ZOMBIE_CROW_TRACE_PREFIX} 33 runFleeTick exception=${err}`)
    }
}

global.zombieCrowRunFight = entity => {
    if (entity.age % 20 === 0) {
        console.log(`${ZOMBIE_CROW_TRACE_PREFIX} 34 runFight entry age=${entity.age} uuid=${entity.uuid}`)
    }
    if (entity.level === 'ClientLevel') {
        if (entity.age % 20 === 0) {
            console.log(`${ZOMBIE_CROW_TRACE_PREFIX} 35 runFight on client level, skipping`)
        }
        return
    }

    // --- Health-check: switch to flee at 1/3 health lost ---
    let maxHealth = entity.getMaxHealth()
    let fleeThreshold = maxHealth * (2 / 3)
    if (entity.age % 20 === 0) {
        console.log(`${ZOMBIE_CROW_TRACE_PREFIX} 36 health=${entity.getHealth()} maxHealth=${maxHealth} fleeThreshold=${fleeThreshold}`)
    }
    if (entity.getHealth() <= fleeThreshold) {
        console.log(`${ZOMBIE_CROW_TRACE_PREFIX} 37 switching to flee (health=${entity.getHealth()} <= threshold=${fleeThreshold})`)
        entity.setSyncedData('isFleeing', 1)
        console.log(`${ZOMBIE_CROW_TRACE_PREFIX} 38 isFleeing set to ${entity.getSyncedData('isFleeing')}`)
        return
    }

    // --- Orbit + attack logic (moved from startup runZombieCrowTick) ---
    let ORBIT_RADIUS = 10

    let nearestPlayer = entity.level.getNearestPlayer(entity, 128)
    if (!nearestPlayer) {
        if (entity.age % 20 === 0) {
            console.log(`${ZOMBIE_CROW_TRACE_PREFIX} 39 no nearest player within range`)
        }
        return
    }
    if (entity.age % 20 === 0) {
        console.log(`${ZOMBIE_CROW_TRACE_PREFIX} 40 nearestPlayer=${nearestPlayer.name ? nearestPlayer.name.string : 'unknown'} pos=${nearestPlayer.x},${nearestPlayer.y},${nearestPlayer.z}`)
    }

    let pointIndex = entity.getSyncedData('orbitalDestinationIndex')
    if (entity.age % 20 === 0) {
        console.log(`${ZOMBIE_CROW_TRACE_PREFIX} 41 orbitalDestinationIndex=${pointIndex}`)
    }

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
    if (entity.age % 20 === 0) {
        console.log(`${ZOMBIE_CROW_TRACE_PREFIX} 42 orbit targetXYZ=${targetX},${targetY},${targetZ}`)
    }

    let entityX = entity.x
    let entityZ = entity.z

    if (entityX > targetX - 1 && entityX < targetX + 1 && entityZ > targetZ - 1 && entityZ < targetZ + 1) {
        console.log(`${ZOMBIE_CROW_TRACE_PREFIX} 43 hit checkpoint at entityXZ=${entityX},${entityZ}`)
        if (pointIndex >= 7) {
            entity.setSyncedData('orbitalDestinationIndex', 0)
            console.log(`${ZOMBIE_CROW_TRACE_PREFIX} 44 checkpoint wrapped to index=0`)
        } else {
            entity.setSyncedData('orbitalDestinationIndex', pointIndex + 1)
            console.log(`${ZOMBIE_CROW_TRACE_PREFIX} 45 checkpoint advanced to index=${pointIndex + 1}`)
        }
    } else if (entity.age % 20 === 0) {
        console.log(`${ZOMBIE_CROW_TRACE_PREFIX} 46 not at checkpoint entityXZ=${entityX},${entityZ}`)
    }

    entity.lookAt("eyes", new Vec3d(targetX, targetY, targetZ))
    entity.getNavigation().moveTo(targetX, targetY, targetZ, 1)
    if (entity.age % 20 === 0) {
        console.log(`${ZOMBIE_CROW_TRACE_PREFIX} 47 movement command issued moveTo(${targetX},${targetY},${targetZ},1)`)
    }

    // Fire projectile every 80 ticks
    if (entity.age % 80 === 0) {
        console.log(`${ZOMBIE_CROW_TRACE_PREFIX} 48 firing projectile at age=${entity.age}`)
        global.spawnZombieCrowProjectile(entity, nearestPlayer)
    } else if (entity.age % 20 === 0) {
        console.log(`${ZOMBIE_CROW_TRACE_PREFIX} 49 projectile cooldown tick age=${entity.age}`)
    }

    // Left-side smoke debug particles
    try {
        let attackingPos = entity.eyePosition
        let defendingPos = nearestPlayer.eyePosition
        if (!attackingPos || !defendingPos) {
            console.log(`${ZOMBIE_CROW_TRACE_PREFIX} 50 missing eye positions attacking=${attackingPos} defending=${defendingPos}`)
            return
        }
        let attackAngle = global.angleVecFromAToB(attackingPos, defendingPos)
        let length = Math.sqrt(attackAngle.x() * attackAngle.x() + attackAngle.z() * attackAngle.z())
        if (length === 0) {
            console.log(`${ZOMBIE_CROW_TRACE_PREFIX} 51 zero horizontal attack vector length, skipping side-smoke`) 
            return
        }
        let leftX = -attackAngle.z() / length * 3
        let leftZ = attackAngle.x() / length * 3
        let smokeX = defendingPos.x() + leftX
        let smokeY = defendingPos.y()
        let smokeZ = defendingPos.z() + leftZ
        if (entity.age % 20 === 0) {
            console.log(`${ZOMBIE_CROW_TRACE_PREFIX} 52 spawning side-smoke at ${smokeX},${smokeY},${smokeZ}`)
        }
        entity.level.spawnParticles('minecraft:smoke', false, smokeX, smokeY, smokeZ, 0, 0, 0, 10, 0.1)
    } catch (err) {
        console.error(`${ZOMBIE_CROW_TRACE_PREFIX} 53 runFight particle exception=${err}`)
    }
}

global.zombieCrowStartFlee = entity => {
    console.log(`${ZOMBIE_CROW_TRACE_PREFIX} 54 startFlee entry uuid=${entity.uuid}`)
    let level = entity.level
    let foundDestination = false
    for (let tries = 0; tries < 10; tries++) {
        console.log(`${ZOMBIE_CROW_TRACE_PREFIX} 55 startFlee try=${tries}`)
        let randomAngleFromBait = getRandomIntInclusive(0, 360)
        let angle = randomAngleFromBait * JavaMath.PI * 2 / 360
        let locationX = entity.x + 0.5 + Math.cos(angle) * 50
        let locationZ = entity.z + 0.5 + Math.sin(angle) * 50
        let targetDestination = new Vec3d(locationX, entity.y, locationZ)
        let start = entity.getEyePosition()
        let clipContext = new ClipContext(start, targetDestination, ClipContext.Block.COLLIDER, ClipContext.Fluid.NONE, entity)
        let result = level.clip(clipContext)
        if (result.getType() !== HitResult.Type.BLOCK) {
            console.log(`${ZOMBIE_CROW_TRACE_PREFIX} 56 startFlee clear path found to ${locationX},${entity.y},${locationZ}`)
            let blockX = Math.floor(locationX), blockY = Math.floor(entity.y), blockZ = Math.floor(locationZ)
            while (level.getBlock(blockX, blockY + 1, blockZ).id != "minecraft:air") { blockY++ }
            while (blockY > 0 && level.getBlock(blockX, blockY, blockZ).id == "minecraft:air") { blockY-- }
            let newYValue = blockY + 15
            console.log(`${ZOMBIE_CROW_TRACE_PREFIX} 57 startFlee destination set to ${locationX},${newYValue},${locationZ}`)
            entity.setSyncedData('ownerBlockLocationX', locationX)
            entity.setSyncedData('ownerBlockLocationY', newYValue)
            entity.setSyncedData('ownerBlockLocationZ', locationZ)
            foundDestination = true
            break
        } else {
            console.log(`${ZOMBIE_CROW_TRACE_PREFIX} 58 startFlee path blocked on try=${tries}`)
        }
    }
    if (!foundDestination) {
        console.log(`${ZOMBIE_CROW_TRACE_PREFIX} 59 startFlee failed to find any valid destination`)
    }
}

global.clampY = (y, minY, maxY) => {
    if (y < minY) {
        console.log(`${ZOMBIE_CROW_TRACE_PREFIX} 60 clampY raised from ${y} to ${minY}`)
        return minY
    } else if (y > maxY) {
        console.log(`${ZOMBIE_CROW_TRACE_PREFIX} 61 clampY lowered from ${y} to ${maxY}`)
        return maxY
    }
    return y
}

global.applyVerticalSteering = (entity, targetY, strength, maxSpeed) => {
    if (!entity || !entity.isAlive()) {
        console.log(`${ZOMBIE_CROW_TRACE_PREFIX} 62 applyVerticalSteering aborted: invalid or dead entity`)
        return
    }

    let dy = targetY - entity.y
    if (Math.abs(dy) < 0.05) {
        if (entity.age % 20 === 0) {
            console.log(`${ZOMBIE_CROW_TRACE_PREFIX} 63 applyVerticalSteering skipped: dy=${dy}`)
        }
        return
    }

    let motion = entity.getDeltaMovement()
    let yVel = Math.max(-maxSpeed, Math.min(maxSpeed, dy * strength))
    if (entity.age % 20 === 0) {
        console.log(`${ZOMBIE_CROW_TRACE_PREFIX} 64 applyVerticalSteering dy=${dy} yVel=${yVel} motionXZ=${motion.x()},${motion.z()}`)
    }

    entity.setMotion(motion.x(), yVel, motion.z())
    if (entity.age % 20 === 0) {
        console.log(`${ZOMBIE_CROW_TRACE_PREFIX} 65 applyVerticalSteering motion applied`)
    }
}