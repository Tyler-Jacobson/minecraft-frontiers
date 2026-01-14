let lastKrakenAction = false


LevelEvents.tick(event => {
    let levelEntities = event.level.entities
    let krakenEntities = levelEntities.filter(entity => {
        return entity.type === 'frontiers:custom_kraken'
    })

    if (krakenEntities.length) {
        krakenEntities.forEach(krakenEntity => {
            if (krakenEntity.age >= krakenEntity.persistentData.startNextActionAge) {
                startNewAction(krakenEntity, event)
                // add here: kraken code that should run at the start of each new action
            }
            if (krakenEntity.age >= krakenEntity.persistentData.startNextSummonActionAge) {
                runSummon(krakenEntity, event)
                // add here: kraken code that should run at the start of each new summon action
            }
            // add here: kraken code that should run every tick

            let lookAtTarget = getPriorityTarget(krakenEntity)
            if (lookAtTarget) {
                krakenEntity.lookAt(lookAtTarget, 30, 30)
                let newYaw = krakenEntity.getYaw()
                krakenEntity.setYaw(newYaw)
            }
        })
    }
})

const startNewAction = (entity, event) => {
    let actionQueue;
    if (!entity.persistentData.actionQueue.length) {
        actionQueue = randomActionSelector(entity)
    } else {
        actionQueue = entity.persistentData.actionQueue[0]
    }
    stopAllAnimations(entity)

    switch (actionQueue) {
        case 'idle':
            runIdle(entity)
            break;
        case 'red':
            runRed(entity, event)
            moveToLocation(entity, 40, 1, 3) // moves the kraken to a location 20 blocks from the player
            break;
        case 'yellow':
            runYellow(entity, event)
            break;
        case 'blue':
            runBlue(entity, event)
            moveToLocation(entity, 5, 1, 0) // moves the kraken to a location 5 blocks from the player
            break;
        case 'white':
            runWhite(entity, event) // giga laser
            break;
        default:
            console.error('ran default in global.startNewAction')
            runIdle(entity)
    }
}

