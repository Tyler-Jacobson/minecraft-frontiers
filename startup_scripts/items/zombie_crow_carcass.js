StartupEvents.registry('block', event => {
    event.create('frontiers:zombie_crow_carcass')
        .displayName('Zombie Crow Carcass')
        .notSolid()
        // .noOcclusion() // this method does not exist
        // .noCollision() // carcass blocks should have collision
})
