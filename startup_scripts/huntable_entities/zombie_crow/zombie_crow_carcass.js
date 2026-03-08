let IntegerProperty = Java.loadClass('net.minecraft.world.level.block.state.properties.IntegerProperty')
let CARCASS_SKINNED_STAGE = IntegerProperty.create("skinned", 0, 4)

StartupEvents.registry('block', event => {
    global.HUNTABLE_BIRD_CONSTANTS.forEach(birdConfig => {
        event.create(birdConfig.HUNTABLE_BIRD_CARCASS_ID)
            .displayName(birdConfig.HUNTABLE_BIRD_CARCASS_DISPLAY_NAME)
            .notSolid()
            .noCollision()
            .property($BlockStateProperties.HORIZONTAL_FACING)
            .property(CARCASS_SKINNED_STAGE)
            .defaultState(state => {
                state.set(CARCASS_SKINNED_STAGE, 0)
            })
    })
})
