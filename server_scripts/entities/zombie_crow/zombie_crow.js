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
            global.zombieCrowRunFlee(goalOnTickEvent)
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

global.zombieCrowRunFlee = entity => {
    try {
        if (!(entity.level === 'ClientLevel')) {
            let targetX = entity.getSyncedData('ownerBlockLocationX')
            let targetY = entity.getSyncedData('ownerBlockLocationY')
            let targetZ = entity.getSyncedData('ownerBlockLocationZ')
            console.log(`fleeing to ${targetX} ${targetY} ${targetZ}`)

            if (entity.isInWater()) { // now that amphib nav is working, is this necessary?
                try {
                    // water nav
                    entity.getLookControl().setLookAt(targetX, targetY, targetZ)
                    entity.getNavigation().moveTo(targetX, targetY, targetZ, 10)
                } catch (err) {
                    console.log(`error setting pathfinding malice ${err}`)
                }
            } else {
                // air navigation
                // entity.getLookControl().setLookAt(targetX, targetY, targetZ)
                console.log(`running ground nav`)
                entity.lookAt("eyes", new Vec3d(targetX, targetY, targetZ))
                entity.getNavigation().moveTo(targetX, entity.y + 3, targetZ, 1)
            }
        }
    } catch (err) {
        console.log(`failed to run zombieCrowRunFlee ${err}`)
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

        let nearestPlayer = null
        let nearestDistance = 999999
        entity.level.players.forEach(player => {
            let distance = entity.distanceToSqr(new Vec3d(player.x, player.y, player.z))
            if (distance < nearestDistance) { nearestDistance = distance; nearestPlayer = player }
        })

        let start = entity.getEyePosition()
        let end = targetDestination
        let clipContext = new ClipContext(start, end, ClipContext.Block.COLLIDER, ClipContext.Fluid.NONE, entity)
        // console.log(`clipContext ${targetDestination} ${nearestPlayer.getEyePosition()}`)


        let result = level.clip(clipContext)
        let blocked = result.getType() === HitResult.Type.BLOCK

        if (!blocked) {
            console.log(`starting flee to ${locationX} ${entity.y} ${locationZ}`)
            // entity.getNavigation().moveTo(locationX, entity.y, locationZ, 1)
            entity.setSyncedData('ownerBlockLocationX', locationX)
            entity.setSyncedData('ownerBlockLocationY', entity.y)
            entity.setSyncedData('ownerBlockLocationZ', locationZ)
            break
        }
    }
}
