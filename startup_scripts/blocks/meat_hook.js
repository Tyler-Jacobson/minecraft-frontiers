StartupEvents.registry('block', event => {
    event.create('frontiers:meat_hook')
        .displayName('Meat Hook')
        .notSolid()
        // .noOcclusion()
        .noCollision()
})
