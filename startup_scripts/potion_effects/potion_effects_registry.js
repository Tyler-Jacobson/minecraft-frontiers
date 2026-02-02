StartupEvents.registry('mob_effect', event => {
    // Create a new effect called "custom_effect"
    event.create('frontiers:on_the_hunt')
        .color(0x4c654a) // Red color for particles
        // .beneficial()    // Can be: .beneficial(), .harmful()
        .category('neutral')
        // .effectTick((entity, lvl) => { // Optional: Run logic every tick
        //     // Example: Heal the entity
        //     entity.heal(0.5 * (lvl + 1))
        //     // can use this for an elytra breaking effect
        // })
        // .modifyAttribute()
})