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
            // add here: kraken code that should run every tick

            // switch this to look at target player
            let nearbyEntities = krakenEntity.level.getEntitiesWithin(krakenEntity.boundingBox.inflate(500))
            // let nearbyPlayers = nearbyEntities.filter(entity => entity.isPlayer() && !entity.creative && !entity.spectator) // switch the below to this
            let nearbyPlayers = nearbyEntities.filter(entity => entity.isPlayer())
            if (nearbyPlayers[0]) {
                krakenEntity.lookAt(nearbyPlayers[0], 30, 30)
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
            break;
        case 'yellow':
            runYellow(entity)
            break;
        case 'blue':
            runBlue(entity)
            break;
        case 'white':
            runWhite(entity) // giga laser
            break;
        default:
            console.error('ran default in global.startNewAction')
            runIdle(entity)
    }
}

