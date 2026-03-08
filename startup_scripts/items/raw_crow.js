StartupEvents.registry("item", event => {
    event.create("frontiers:raw_crow", "basic")
        .displayName("Raw Crow")
        .texture('layer0', 'frontiers:item/hunting_system/raw_crow')
        .food(food => {
            food.hunger(1)
                .saturation(0.3)
                .meat()
                .effect('minecraft:hunger', 600, 0, 1.0)
        })
})
