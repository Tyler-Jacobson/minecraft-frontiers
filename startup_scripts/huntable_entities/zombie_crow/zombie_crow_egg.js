let IntegerProperty = Java.loadClass('net.minecraft.world.level.block.state.properties.IntegerProperty')

StartupEvents.registry('block', event => {
    global.HUNTABLE_BIRD_CONSTANTS.forEach(birdConfig => {
        event.create(birdConfig.HUNTABLE_BIRD_EGG_ID)
            .displayName(birdConfig.HUNTABLE_BIRD_EGG_DISPLAY_NAME)
            .textureAll(birdConfig.HUNTABLE_BIRD_EGG_TEXTURE)
            .hardness(0.5)
            .resistance(0.5)
            .noDrops()
            .property(IntegerProperty.create('current_health', 0, birdConfig.HUNTABLE_BIRD_EGG_MAX_HEALTH))
            .property(IntegerProperty.create('current_phase', 0, birdConfig.HUNTABLE_BIRD_EGG_MAX_PHASE))
            .placementState(placementContext => {
                console.log('placed egg')
            })
    })
})

