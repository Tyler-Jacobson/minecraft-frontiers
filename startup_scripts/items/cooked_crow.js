StartupEvents.registry("item", event => {
    event.create("frontiers:cooked_crow", "basic")
        .displayName("Cooked Crow")
        .food(food => {
            food.hunger(6)
                .saturation(0.6)
                .meat()
        })
})
