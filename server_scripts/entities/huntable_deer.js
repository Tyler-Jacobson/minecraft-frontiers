let LivingEntity = Java.loadClass('net.minecraft.world.entity.LivingEntity')
let CustomGoal = Java.loadClass("net.liopyu.entityjs.util.ai.CustomGoal")
let EnumSet = Java.loadClass("java.util.EnumSet")
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

EntityJSEvents.addGoalSelectors('frontiers:huntable_deer_test', event => {
    console.log('goal selector registry code')
    event.floatSwim(1)
    event.meleeAttack(2, 1.5, true)
    event.customGoal(
        "customTestGoal",
        0,
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
    // console.log(`registry time ${event.entity.goalSelector.getAvailableGoals().find(goalSelector => goalSelector.goal.getName() == "customTestGoal")}`)
    const entityCurrentGoals = event.entity.goalSelector.getAvailableGoals()
    const customTestGoal = entityCurrentGoals.find(goalSelector => {
        return goalSelector.getGoal().toString() === 'CustomGoal[customTestGoal]'
    })
    // console.log(`customTestGoal ${Object.keys(customTestGoal.getGoal().setFlags(EnumSet.of($MoveGoalFlag.MOVE)))}`)
    // customTestGoal.getGoal().setFlags(EnumSet.of("MOVE"))
    customTestGoal.setFlags(EnumSet.of($MoveGoalFlag.MOVE))
    entityCurrentGoals.forEach((goalSelector) => {
        // console.log(`selector names ${goalSelector.getGoal().toString() === 'CustomGoal[customTestGoal]'}`) // this works
        console.log(`selector names ${goalSelector.getGoal().getFlags()}`) // this works
    })
    // let currentGoal = event.goalSelector.getAvailableGoals().find(selector => selector.goal.class instanceof CustomGoal && selector.goal.getName() == "customTestGoal")
    // currentGoal.setFlags(EnumSet.of("MOVE"))
    // e.customGoal("randomFly",
    //     3,
    //     e => (!(e.onGround() && e.getSyncedData("Sleeping")) && e.getSyncedData("FollowMode") != "sitting"),
    //     e => !(e.onGround() && e.getSyncedData("Sleeping")) && e.getSyncedData("FollowMode") != "sitting",
    //     true, e => { },
    //     e => { },
    //     true,
    //     entity => global.flyGoal(entity)
    // )
    // e.customGoal("followOwner",
    //     4,
    //     e => e.owner != undefined && e.getSyncedData("FollowMode") == "following",
    //     e => e.owner != undefined && e.getSyncedData("FollowMode") == "following",
    //     true, e => { },
    //     e => { },
    //     true,
    //     entity => global.followOwner(entity)
    // )
    // e.breed(5, 1, null)
})

global.runCustom = entity => {
    try {
        // entity.goalSelector.setNewGoalRate(100) // this does not work
        // console.log(`try run custom for entity2 ${Object.keys(entity.goalSelector)} ${entity.getTags()}`)
    } catch (err) {

    }
}