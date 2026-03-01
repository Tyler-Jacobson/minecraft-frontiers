StartupEvents.registry('block', event => {
    event.create('frontiers:zombie_crow_carcass')
        .displayName('Zombie Crow Carcass')
        .notSolid()
        .noCollision()
        .property($BlockStateProperties.HORIZONTAL_FACING)
})
