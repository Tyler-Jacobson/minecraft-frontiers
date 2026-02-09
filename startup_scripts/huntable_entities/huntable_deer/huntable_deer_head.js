


StartupEvents.registry('entity_type', event => {
    const builder = event.create('frontiers:huntable_deer_head', 'entityjs:tamable')
        .mobCategory('creature')
        .sized(0.9, 0.9)
        .eggItem(item => {
            item.backgroundColor(0xff0000)
            item.highlightColor(0xffbe8f)
        })
        .tick(entity => { })
    builder.onAddedToWorld(entity => {
        // entity.setPathfindingMalus(BlockPathTypes.WATER, 0.0)
        // entity.setPathfindingMalus(BlockPathTypes.WATER_BORDER, 0.0)
        // goalOnTickEvent.getNavigation().recomputePath()
    })
    builder.newGeoLayer(builder => {
        builder.textureResource(e => `frontiers:textures/entity/huntable_deer_head.png`)
    })
    builder.onHurt(context => {
        // Log the amount of damage received by the entity
        global.runOnHurt(context)
    })
    builder.aiStep(entity => {
        if (!(entity.level === 'ClientLevel')) {

        }
    })
    // builder.createNavigation(context => EntityJSUtils.createAmphibiousPathNavigation(context.entity, context.level))
})