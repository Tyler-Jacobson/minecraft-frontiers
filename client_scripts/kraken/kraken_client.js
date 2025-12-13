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
