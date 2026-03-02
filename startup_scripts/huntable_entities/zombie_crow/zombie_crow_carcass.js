let BooleanProperty = Java.loadClass('net.minecraft.world.level.block.state.properties.BooleanProperty')
let CARCASS_SKINNED = BooleanProperty.create("skinned")

StartupEvents.registry('block', event => {
    event.create('frontiers:zombie_crow_carcass')
        .displayName('Zombie Crow Carcass')
        .notSolid()
        .noCollision()
        .property($BlockStateProperties.HORIZONTAL_FACING)
        .property(CARCASS_SKINNED)
        .defaultState(state => {
            state.set(CARCASS_SKINNED, false)
        })
})
