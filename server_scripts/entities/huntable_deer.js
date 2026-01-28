let LivingEntity = Java.loadClass('net.minecraft.world.entity.LivingEntity')
let CustomGoal = Java.loadClass("net.liopyu.entityjs.util.ai.CustomGoal")
let $MoveGoalFlag = Java.loadClass("net.minecraft.world.entity.ai.goal.Goal$Flag")
let BlockPos = Java.loadClass("net.minecraft.core.BlockPos");
let DefaultRandomPos = Java.loadClass("net.minecraft.world.entity.ai.util.DefaultRandomPos")
let BlockPathTypes = Java.loadClass("net.minecraft.world.level.pathfinder.BlockPathTypes")


EntityJSEvents.addGoalSelectors('frontiers:huntable_deer_test', event => { // goal selectors
    console.log('goal selector registry code')
    // event.floatSwim(1)
    // event.meleeAttack(2, 1.5, true)
    event.customGoal( // the default floatSwim goal was causing the mob to launch multiple blocks into the air while trying to float
        "dampedSwim",
        1,
        canUseEvent => {
            if (canUseEvent.wasEyeInWater) {
                return true
            }
            return false
        },
        canContinueToUseEvent => {
            // return true
            if (canContinueToUseEvent.wasEyeInWater) {
                return true
            }
            return false
        },
        true, // isInterruptable
        goalOnStartedEvent => { },
        goalOnStoppedEvent => { },
        true, // requiresUpdateEveryTick
        goalOnTickEvent => {
            global.runDampedSwim(goalOnTickEvent)

        }
    )
    event.customGoal(
        "recalculateNav",
        1,
        canUseEvent => {
            if ((canUseEvent.getSyncedData('timeSpentAtCurrentLocation') > 40)) {
                return true
            }
            return false
        },
        canContinueToUseEvent => {
            if (canContinueToUseEvent.getNavigation().isDone()) {
                return false
            }
            return true
        },
        true, // isInterruptable
        goalOnStartedEvent => {
            goalOnStartedEvent.getNavigation().recomputePath()
            console.log(`recalculating nav`)

        },
        goalOnStoppedEvent => { },
        true, // requiresUpdateEveryTick
        goalOnTickEvent => { }
    )
    event.panic(2, 1)
    event.customGoal(
        "unstuck",
        2,
        canUseEvent => {
            if ((canUseEvent.getSyncedData('timeSpentAtCurrentLocation') > 100)) {
                console.log(`entity is stuck`)
                return true
            }
            return false
        }, // check if 'stuck' is greater than 100
        canContinueToUseEvent => {
            if (canContinueToUseEvent.getNavigation().isDone()) {
                return false
            }
            return true
        },
        true, // isInterruptable
        goalOnStartedEvent => {
            console.log(`starting unstuck`)
        },
        goalOnStoppedEvent => { },
        true, // requiresUpdateEveryTick
        goalOnTickEvent => {
            global.runUnstuckPanic(goalOnTickEvent)
        }
    )
    event.customGoal(
        "navigateToBait",
        10,
        canUseEvent => true,
        canContinueToUseEvent => true,
        true, // isInterruptable
        goalOnStartedEvent => { },
        goalOnStoppedEvent => { },
        true, // requiresUpdateEveryTick
        goalOnTickEvent => {
            global.runNavigateToBait(goalOnTickEvent)
        }
    )

    registerCustomGoalFlag(event, 'CustomGoal[unstuck]', $MoveGoalFlag.MOVE)
    registerCustomGoalFlag(event, 'CustomGoal[navigateToBait]', $MoveGoalFlag.MOVE)
    registerCustomGoalFlag(event, 'CustomGoal[dampedSwim]', $MoveGoalFlag.JUMP)

    logRegisteredGoals(event)
})

EntityJSEvents.addGoals('frontiers:huntable_deer_test', event => { // target selectors
    let mob = event.entity
    let followRange = mob.getAttribute("minecraft:generic.follow_range").value
    event.ownerHurtByTarget(0)
    event.hurtByTarget(1, [], true, [])

    // console.log(`goal selector ${mob.goalSelector.newGoalRate}`)
    // console.log(`goal selector ${Object.keys(mob.goalSelector)}`)
    // console.log(`target selector ${Object.keys(mob.targetSelector)}`)
    // event.nearestAttackableTarget(2, LivingEntity, 10, true, false, t => global.canAttackNearbyTarget(mob, t), mob.boundingBox.inflate(followRange, 25, followRange))
})

global.runDampedSwim = entity => {
    if (entity.isInWater()) {
        let currentX = entity.getDeltaMovement().x()
        let currentZ = entity.getDeltaMovement().z()
        entity.setDeltaMovement(new Vec3d(currentX, 0.05, currentZ))
    }
}

global.runNavigateToBait = entity => {
    try {
        if (!(entity.level === 'ClientLevel')) {
            console.log(`entity.getSyncedData('timeSpentAtCurrentLocation') ${entity.getSyncedData('timeSpentAtCurrentLocation')}`)
            let targetX = entity.getSyncedData('ownerBlockLocationX')
            let targetY = entity.getSyncedData('ownerBlockLocationY')
            let targetZ = entity.getSyncedData('ownerBlockLocationZ')
            if (entity.isInWater()) {
                try {
                    // entity.setNavigation(EntityJSUtils.createWaterBoundPathNavigation(entity, entity.level))
                    // entity.setPathfindingMalus(BlockPathTypes.WATER, 0.0)
                    // entity.setPathfindingMalus(BlockPathTypes.WATER_BORDER, 0.0)
                    // entity.setPathfindingMalus(BlockPathTypes.WALKABLE, 0.0)
                    entity.getLookControl().setLookAt(targetX, targetY, targetZ)
                    entity.getNavigation().moveTo(targetX, targetY, targetZ, 10)
                    // entity.jump()
                } catch (err) {
                    console.log(`error setting pathfinding malice ${err}`)
                }
                // console.log('water nav mode')
            } else {
                // entity.setNavigation(EntityJSUtils.createGroundPathNavigation(entity, entity.level))
                entity.getNavigation().moveTo(targetX, targetY, targetZ, 0.5)
                console.log('land nav mode')
            }
        }


    } catch (err) {
        console.log(`failed to runNavigateToBait ${err}`)
    }
}

global.runUnstuckPanic = entity => {
    let randomPos = DefaultRandomPos.getPos(entity, 5, 10);
    if (randomPos && entity.getNavigation().isDone()) {
        entity.getNavigation().moveTo(randomPos.x(), randomPos.y(), randomPos.z(), 1)
        console.log(`running unstuck panic navigation`)
    }
}