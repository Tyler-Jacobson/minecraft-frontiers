ClientEvents.tick(event => {
    if (!event.level) {
        return
    }

    let allBirdTypeIds = global.HUNTABLE_BIRD_CONSTANTS.map(cfg => cfg.HUNTABLE_BIRD_ID)
    let levelEntities = event.level.entities
    let huntableBirdEntities = levelEntities.filter(entity => {
        return allBirdTypeIds.includes(entity.type)
    })

    if (huntableBirdEntities.length) {
        huntableBirdEntities.forEach(birdEntity => {
            let currentYaw = birdEntity.getYaw()
            birdEntity.setYBodyRot(currentYaw)
        })
    }
})
