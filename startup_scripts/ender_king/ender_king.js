let newMobGoal = 'none'

StartupEvents.registry('entity_type', event => {
    event.create('frontiers:custom_enderman_geckolib', 'entityjs:mob')
        .clientTrackingRange(20)
        .mobCategory('monster')
        .mobType('undead')
        .animationResource(entity => {
            return 'frontiers:animations/entity/custom_enderman_geckolib.animation.json'
        })
        .addAnimationController('enderKingController', 1, event => {

            event.addTriggerableAnimation('hurt_custom_enderman_geckolib', 'hurtID', 'default')

            // if (event.entity.hurtTime > 8) {
            //     event.thenPlay('hurt_custom_enderman_geckolib')
            // }

            if (!event.isMoving()) {
                event.thenLoop('idle_custom_enderman_geckolib')
            }

            return true
        })
        .tick(entity => {
            // entity.goalSelector.availableGoals.forEach(goal => console.log(goal.goal.toString()))
            entity.goalSelector.getRunningGoals().forEach(goal => {
                if (goal.goal && (newMobGoal !== goal.goal)) {
                    console.info(`new mob goal: ${goal.goal.toString()}`)
                    console.log(`entity age ${entity.age}`)
                    newMobGoal = goal.goal
                }
            })
            

            // getRunningGoals

            if (entity.hurtTime > 8) {
                entity.triggerAnimation('enderKingController', 'hurtID')
            }
        })
})

