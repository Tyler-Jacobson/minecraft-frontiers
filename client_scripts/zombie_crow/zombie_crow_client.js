ClientEvents.tick(event => {
    if (!event.level) {
        return
    }

    let levelEntities = event.level.entities
    let zombieCrowEntities = levelEntities.filter(entity => {
        return entity.type === global.HUNTABLE_BIRD_CONSTANTS.HUNTABLE_BIRD_ID
    })

    if (zombieCrowEntities.length) {
        zombieCrowEntities.forEach(zombieCrowEntity => {
            let currentYaw = zombieCrowEntity.getYaw()
            zombieCrowEntity.setYBodyRot(currentYaw)
        })
    }
})
