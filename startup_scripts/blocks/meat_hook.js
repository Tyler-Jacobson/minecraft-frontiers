StartupEvents.registry('block', event => {
    event.create('frontiers:meat_hook')
        .displayName('Meat Hook')
        .notSolid()
        // .noOcclusion()
        .noCollision()
        .property($BlockStateProperties.HORIZONTAL_FACING)
        .placementState(ctx => {
            ctx.set($BlockStateProperties.HORIZONTAL_FACING, ctx.getHorizontalDirection())
        })
})
