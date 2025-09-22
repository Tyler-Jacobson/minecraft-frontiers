ServerEvents.tick(event => {

})

EntityJSEvents.addGoalSelectors('frontiers:custom_enderman_geckolib', event => { // adds goal selectors to entity
    let Player = Java.loadClass('net.minecraft.world.entity.player.Player')

    // I think I'm supposed to set conditional logic here, changing the priority of actions based on conditionals

    // event.panic(1, 2) // makes the mob run around randomly
    event.floatSwim(1)
    event.meleeAttack(4, 1, true) // as far as I can tell this is the goal that runs when he actually attacks? MeleeAttackGoal
    event.leapAtTarget(3, 0.4)
    event.waterAvoidingRandomStroll(5, 0.4, 0.8)
    event.lookAtEntity(6, Player, 8, 0.8, false) // makes the entity move its head slightly towards facing the player every few seconds
    event.randomLookAround(7)
    event.customGoal( // makes the mob follow the nearest player
        'follow_target',
        2,
        mob => true,
        mob => true,
        true,
        mob => { },
        mob => mob.getNavigation().stop(),
        true,
        /** @param {Internal.Mob} mob */ mob => {
            let mobAABB = mob.boundingBox.inflate(5)
            mob.level.getEntitiesWithin(mobAABB).forEach(entity => {
                if (entity == null) return
                if (entity.player && entity.distanceToEntity(mob) < 20) {
                    mob.getNavigation().moveTo(entity.block.x, entity.y, entity.z, 1.0);
                }
            })
        }
    )
    // let $PanicGoal = Java.loadClass("net.minecraft.world.entity.ai.goal.PanicGoal")
    // event.removeGoal($PanicGoal)
    // event.removeGoals(context => {
    //     const { goal, entity } = context
    //     return goal.getClass() == $PanicGoal
    // })
    // event.entity.goalSelector.availableGoals.forEach(goal => console.log(goal.goal.toString()))
})

EntityJSEvents.addGoals("frontiers:custom_enderman_geckolib", event => { // adds target selectors to entity

    // this allows the entity to be 'passive' until attacked. I'm not really sure what purpose the cow serves
    let Cow = Java.loadClass('net.minecraft.world.entity.animal.Cow')
    let Player = Java.loadClass('net.minecraft.world.entity.player.Player')
    console.info(`playerevent ${Object.keys(Player)}`)

    event.hurtByTarget(1, [Cow], true, [Cow])
    // event.nearestAttackableTarget(2, Player, 5, false, false, entity => {
    //     return entity.age < 100
    // })
    event.nearestAttackableTarget(2, Player, 5, false, false, entity => {
        return true
    })


    event.entity.goalSelector.availableGoals.forEach(goal => console.log(goal.goal.toString()))

    // const $BreedGoal = Java.loadClass('net.minecraft.world.entity.ai.goal.BreedGoal')
    // event.arbitraryTargetGoal(2, entity => new $BreedGoal(entity, 1))
    // let $PanicGoal = Java.loadClass("net.minecraft.world.entity.ai.goal.PanicGoal")
    // event.removeGoal($PanicGoal)
    // event.removeGoals(context => {
    //     const { goal, entity } = context
    //     return goal.getClass() == $PanicGoal
    // })
})