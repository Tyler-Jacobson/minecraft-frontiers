StartupEvents.registry('block', event => {
    event.create('frontiers:meat_hook')
        .displayName('Meat Hook')
        .box(5, 6, 5, 11, 16, 11)
        .notSolid()
        .noCollision()
        .property($BlockStateProperties.HORIZONTAL_FACING)
        .placementState(placementContext => {
            placementContext.set($BlockStateProperties.HORIZONTAL_FACING, placementContext.getHorizontalDirection())
        })
})
