StartupEvents.registry("item", event => {
    event.create("frontiers:zombie_crow_flesh", "basic")
        .displayName("Zombie Crow Flesh")
        .food(food => {
            food.hunger(2)
                .saturation(0.1)
                .meat()
                .effect('minecraft:hunger', 600, 0, 1.0)
        })
})
