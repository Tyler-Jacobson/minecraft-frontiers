ClientEvents.tick(event => {
    let levelEntities = event.level.entities
    let krakenEntities = levelEntities.filter(entity => {
        return entity.type === 'frontiers:custom_kraken'
    })

    if (krakenEntities.length) {
        krakenEntities.forEach(krakenEntity => {
            // add here: kraken code that should run every tick

            let newYaw = krakenEntity.getYaw()
            krakenEntity.setYBodyRot(newYaw)
        })
    }
})

NetworkEvents.dataReceived("play_kraken_red_laser1", event => {
    event.player.playSound("frontiers:kraken_red_laser1", 0.5, 0) // sound name, volume, pitch
})


NetworkEvents.dataReceived("play_kraken_red_laser2", event => {
    event.player.playSound("frontiers:kraken_red_laser2", 0.5, 0) // sound name, volume, pitch
})


NetworkEvents.dataReceived("play_kraken_red_laser3", event => {
    event.player.playSound("frontiers:kraken_red_laser3", 0.5, 0) // sound name, volume, pitch
})