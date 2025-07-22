MoreJSEvents.filterAvailableEnchantments((event) => { // this handles which enhcantments can be given to an item ONLY when using the enchantment table
    if (event.getItem() === 'frontiers:fire_staff') {
        console.info(`running filterAvailableEnchants code`)
        event.remove("minecraft:sharpness")
        event.remove("minecraft:bane_of_arthropods")
        event.remove("minecraft:smite")
        event.remove("minecraft:fire_aspect")
        event.remove("minecraft:knockback")
        event.remove("minecraft:looting")
        event.remove("minecraft:sweeping")
        event.add("minecraft:power")
        event.add("minecraft:unbreaking")
        event.add("minecraft:mending")
        event.add("frontiers:kindness")
    }
    if (event.getItem() === 'minecraft:book') {
        event.add("minecraft:mending")
    }
    if (event.getItem() === 'minecraft:diamond_horse_armor') {
        event.add("minecraft:frost_walker")
        event.add("minecraft:depth_strider")
    }
})