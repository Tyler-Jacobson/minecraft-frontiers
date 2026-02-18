let LivingEntity = Java.loadClass('net.minecraft.world.entity.LivingEntity')
let CustomGoal = Java.loadClass("net.liopyu.entityjs.util.ai.CustomGoal")
let $MoveGoalFlag = Java.loadClass("net.minecraft.world.entity.ai.goal.Goal$Flag")
let DefaultRandomPos = Java.loadClass("net.minecraft.world.entity.ai.util.DefaultRandomPos")
let ClipContext = Java.loadClass('net.minecraft.world.level.ClipContext')
let HitResult = Java.loadClass('net.minecraft.world.phys.HitResult')




EntityJSEvents.addGoalSelectors('frontiers:zombie_crow', event => { // goal selectors
    event.customGoal( // the default floatSwim goal was causing the mob to launch multiple blocks into the air while trying to float
        "fight",
        1,
        canUseEvent => {
            if (canUseEvent.getSyncedData('alertness') >= 40) {
                return true
            }
            return false
        },
        canContinueToUseEvent => true,
        false, // isInterruptable
        goalOnStartedEvent => { },
        goalOnStoppedEvent => { },
        true, // requiresUpdateEveryTick
        goalOnTickEvent => {
            global.zombieCrowRunFight(goalOnTickEvent)
        }
    )
    event.customGoal(
        "flee",
        2,
        canUseEvent => true,
        canContinueToUseEvent => true,
        true, // isInterruptable
        goalOnStartedEvent => {
            console.log(`started flee`)
            global.zombieCrowStartFlee(goalOnStartedEvent)
        },
        goalOnStoppedEvent => { },
        true, // requiresUpdateEveryTick
        goalOnTickEvent => {
            global.zombieCrowRunFleeTick(goalOnTickEvent)
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
            let targetX = entity.getSyncedData('ownerBlockLocationX')
            let targetY = entity.getSyncedData('ownerBlockLocationY')
            let targetZ = entity.getSyncedData('ownerBlockLocationZ')
            let clampedY = global.clampY(targetY, entity.y - 3, entity.y + 3)
            console.log(`fleeing to ${targetX} ${targetY} ${targetZ}`)
            if (entity.isInWater()) {
                entity.getLookControl().setLookAt(targetX, clampedY, targetZ)
                entity.getNavigation().moveTo(targetX, clampedY, targetZ, 10)
            } else {
                console.log(`running ground nav`)
                entity.lookAt("eyes", new Vec3d(targetX, clampedY, targetZ))
                entity.getNavigation().moveTo(targetX, clampedY, targetZ, 1)
            }
        }
    } catch (err) { console.log(`failed to run zombieCrowRunFleeTick ${err}`) }
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