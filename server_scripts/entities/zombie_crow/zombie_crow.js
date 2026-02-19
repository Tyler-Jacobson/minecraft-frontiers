let LivingEntity = Java.loadClass('net.minecraft.world.entity.LivingEntity')
let CustomGoal = Java.loadClass("net.liopyu.entityjs.util.ai.CustomGoal")
let $MoveGoalFlag = Java.loadClass("net.minecraft.world.entity.ai.goal.Goal$Flag")
let DefaultRandomPos = Java.loadClass("net.minecraft.world.entity.ai.util.DefaultRandomPos")
let ClipContext = Java.loadClass('net.minecraft.world.level.ClipContext')
let HitResult = Java.loadClass('net.minecraft.world.phys.HitResult')




EntityJSEvents.addGoalSelectors('frontiers:zombie_crow', event => { // goal selectors
    event.customGoal(
        "fight",
        1,
        entity => { // this is canUse. return true here if the entity can start the goal during this tick.
            if (entity.getSyncedData('alertness') >= 40) {
                return true
            }
            return false
        },
        entity => true,
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
        entity => true, // this is canUse. return true here if the entity can start the goal during this tick.
        entity => true, // this is canContinueToUse. return true here if the entity can continue to use the goal during this tick
        true, // isInterruptable
        entity => { // goalOnStartedEvent. this runs once when the goal starts
            console.log(`started flee`)
            global.zombieCrowStartFlee(entity)
        },
        entity => { }, // goalOnEndedEvent. this runs once when the goal ends
        true, // requiresUpdateEveryTick
        entity => { // goalOnTickEvent. this runs once every tick while the goal is running
            global.zombieCrowRunFleeTick(entity)
        }
    )

    registerCustomGoalFlag(event, 'CustomGoal[fight]', $MoveGoalFlag.MOVE)
    registerCustomGoalFlag(event, 'CustomGoal[fight]', $MoveGoalFlag.JUMP)
    registerCustomGoalFlag(event, 'CustomGoal[fight]', $MoveGoalFlag.LOOK)

    registerCustomGoalFlag(event, 'CustomGoal[flee]', $MoveGoalFlag.MOVE)
    registerCustomGoalFlag(event, 'CustomGoal[flee]', $MoveGoalFlag.JUMP)
    registerCustomGoalFlag(event, 'CustomGoal[flee]', $MoveGoalFlag.LOOK)

    logRegisteredGoals(event)
})

EntityJSEvents.addGoals('frontiers:zombie_crow', event => { // target selectors
    event.ownerHurtByTarget(0)
    event.hurtByTarget(1, [], true, [])
})

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
                    // level.setBlock(hit.x, hit.y, hit.z, "frontiers:zombie_crow_egg")
                    Utils.server.runCommandSilent(`execute in ${entity.level.getDimension()} run setblock ${hit.x} ${hit.y + 1} ${hit.z} frontiers:zombie_crow_egg`)

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
                if (desiredY > entity.y) desiredY = entity.y
            } else {
                if (desiredY < entity.y) desiredY = entity.y
            }

            let clampedY = global.clampY(desiredY, entity.y - 3, entity.y + 3)
            if (entity.isInWater()) {
                entity.getLookControl().setLookAt(targetX, clampedY, targetZ); entity.getNavigation().moveTo(targetX, clampedY, targetZ, 10)
            } else {
                console.log(`running ground nav`);
                entity.lookAt("eyes", new Vec3d(targetX, clampedY, targetZ))
                entity.getNavigation().moveTo(targetX, clampedY, targetZ, 1)
                global.applyVerticalSteering(entity, clampedY, 0.15, 0.2)
            }
        }
    } catch (err) {
        console.log(`failed to run zombieCrowRunFleeTick ${err}`)
    }
}

global.zombieCrowRunFight = entity => {
    let uuid = entity.uuid
    let level = entity.level

    Utils.server.scheduleInTicks(20, () => {
        global.runDespawn(uuid, level)
    })
}

global.zombieCrowStartFlee = entity => {
    let level = entity.level
    for (let tries = 0; tries < 10; tries++) {
        console.log(`trying to find destination ${tries}`)
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
            console.log(`starting flee to ${locationX} ${newYValue} ${locationZ}`)
            entity.setSyncedData('ownerBlockLocationX', locationX)
            entity.setSyncedData('ownerBlockLocationY', newYValue)
            entity.setSyncedData('ownerBlockLocationZ', locationZ)
            break
        }
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
    if (!entity || !entity.isAlive()) return

    let dy = targetY - entity.y
    if (Math.abs(dy) < 0.05) return

    let motion = entity.getDeltaMovement()
    let yVel = Math.max(-maxSpeed, Math.min(maxSpeed, dy * strength))

    entity.setMotion(motion.x(), yVel, motion.z())
}