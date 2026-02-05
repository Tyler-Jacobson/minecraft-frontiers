let LivingEntity = Java.loadClass('net.minecraft.world.entity.LivingEntity')
let CustomGoal = Java.loadClass("net.liopyu.entityjs.util.ai.CustomGoal")
let $MoveGoalFlag = Java.loadClass("net.minecraft.world.entity.ai.goal.Goal$Flag")
let DefaultRandomPos = Java.loadClass("net.minecraft.world.entity.ai.util.DefaultRandomPos")


EntityJSEvents.addGoalSelectors('frontiers:huntable_deer_test', event => { // goal selectors
    console.log('goal selector registry code')
    // event.floatSwim(1)
    // event.meleeAttack(2, 1.5, true)
    event.customGoal( // the default floatSwim goal was causing the mob to launch multiple blocks into the air while trying to float
        "startDespawn",
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
            global.startDespawn(goalOnTickEvent)
        }
    )
    event.customGoal( // the default floatSwim goal was causing the mob to launch multiple blocks into the air while trying to float
        "dampedSwim",
        2,
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
        2,
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
    event.panic(3, 1)
    event.customGoal(
        "unstuck",
        3,
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
