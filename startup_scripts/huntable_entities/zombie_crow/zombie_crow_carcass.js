let IntegerProperty = Java.loadClass('net.minecraft.world.level.block.state.properties.IntegerProperty')
let CARCASS_SKINNED_STAGE = IntegerProperty.create("skinned", 0, 4)

StartupEvents.registry('block', event => {
    event.create(global.ZOMBIE_CROW_CARCASS_ID)
        .displayName('Zombie Crow Carcass')
        .notSolid()
        .noCollision()
        .property($BlockStateProperties.HORIZONTAL_FACING)
        .property(CARCASS_SKINNED_STAGE)
        .defaultState(state => {
            state.set(CARCASS_SKINNED_STAGE, 0)
        })
})
