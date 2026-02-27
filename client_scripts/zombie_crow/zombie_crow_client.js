ClientEvents.tick(event => {
    if (!event.level) {
        return
    }

    let levelEntities = event.level.entities
    let zombieCrowEntities = levelEntities.filter(entity => {
        return entity.type === 'frontiers:zombie_crow'
    })

    if (zombieCrowEntities.length) {
        zombieCrowEntities.forEach(zombieCrowEntity => {
            let currentYaw = zombieCrowEntity.getYaw()
            zombieCrowEntity.setYBodyRot(currentYaw)
        })
    }
})
