let LivingEntity = Java.loadClass('net.minecraft.world.entity.LivingEntity')
let CustomGoal = Java.loadClass("net.liopyu.entityjs.util.ai.CustomGoal")
let $MoveGoalFlag = Java.loadClass("net.minecraft.world.entity.ai.goal.Goal$Flag")


EntityJSEvents.addGoals('frontiers:huntable_deer_test', event => {
    let mob = event.entity
    let followRange = mob.getAttribute("minecraft:generic.follow_range").value
    event.ownerHurtByTarget(0)
    event.hurtByTarget(1, [], true, [])
    // console.log(`goal selector ${mob.goalSelector.newGoalRate}`)
    // console.log(`goal selector ${Object.keys(mob.goalSelector)}`)
    // console.log(`target selector ${Object.keys(mob.targetSelector)}`)
    // event.nearestAttackableTarget(2, LivingEntity, 10, true, false, t => global.canAttackNearbyTarget(mob, t), mob.boundingBox.inflate(followRange, 25, followRange))
})

EntityJSEvents.addGoalSelectors('frontiers:huntable_deer_test', event => { // goal selectors
    console.log('goal selector registry code')
    event.floatSwim(1)
    event.meleeAttack(2, 1.5, true)
    event.customGoal(
        "customTestGoal",
        3,
        canUseEvent => true, // probably need to manually check flags here?
        canContinueToUseEvent => true, // probably need to manually check flags here too
        true, // isInterruptable
        goalOnStartedEvent => {
            console.log(`goal started ${Object.keys(goalOnStartedEvent)}`)

        },
        goalOnStoppedEvent => { },
        true, // requiresUpdateEveryTick
        goalOnTickEvent => global.runCustom(goalOnTickEvent) // maybe this is the entity?
    )

    registerCustomGoalFlag(event, 'CustomGoal[customTestGoal]', $MoveGoalFlag.MOVE)

    logRegisteredGoals(event)
})



global.runCustom = entity => {
    try {
        // entity.goalSelector.setNewGoalRate(100) // this does not work
        // console.log(`try run custom for entity2 ${Object.keys(entity.goalSelector)} ${entity.getTags()}`)
        // let mappedReturn = entity.goalSelector.getRunningGoals().toList()
        // mappedReturn.forEach(mappedGoal => {
        //     console.log(`try run custom for entity3 ${mappedGoal.getGoal().toString()}`)
        // })


    } catch (err) {

    }
}