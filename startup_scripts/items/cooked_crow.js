StartupEvents.registry("item", event => {
    event.create("frontiers:cooked_crow", "basic")
        .displayName("Cooked Crow")
        .texture('layer0', 'frontiers:item/zombie_crow/cooked_crow')
        .food(food => {
            food.hunger(6)
                .saturation(0.6)
                .meat()
        })
})
