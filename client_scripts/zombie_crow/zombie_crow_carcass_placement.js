BlockEvents.rightClicked(event => {
    if (event.item.id !== global.HUNTABLE_BIRD_CONSTANTS.HUNTABLE_BIRD_CARCASS_ID) return
    if (event.block.id === 'frontiers:meat_hook') {
        event.player.swing(event.hand, true)
    }
    event.cancel()
})
