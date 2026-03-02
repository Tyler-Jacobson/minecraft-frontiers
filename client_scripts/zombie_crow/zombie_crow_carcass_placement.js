BlockEvents.rightClicked(event => {
    if (event.item.id !== 'frontiers:zombie_crow_carcass') return
    if (event.block.id === 'frontiers:meat_hook') {
        event.player.swing(event.hand, true)
    }
    event.cancel()
})
