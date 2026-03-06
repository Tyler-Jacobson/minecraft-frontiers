BlockEvents.rightClicked(event => {
    if (event.item.id !== global.HUNTABLE_BIRD_CONSTANTS.HUNTABLE_BIRD_CARCASS_ID) return

    if (event.block.id !== 'frontiers:meat_hook') {
        event.cancel()
        return
    }

    let hookFacing = event.block.properties.get('facing')
    event.block.set(global.HUNTABLE_BIRD_CONSTANTS.HUNTABLE_BIRD_CARCASS_ID, { facing: hookFacing })

    if (!event.player.isCreativeMode) {
        event.item.count--
    }

    event.cancel()
})
