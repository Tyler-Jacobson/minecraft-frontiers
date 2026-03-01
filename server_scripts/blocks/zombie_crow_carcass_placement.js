BlockEvents.rightClicked(event => {
    if (event.item.id !== 'frontiers:zombie_crow_carcass') return

    if (event.block.id !== 'butchersdelight:hook') {
        event.cancel()
        return
    }

    event.block.set('frontiers:zombie_crow_carcass')

    if (!event.player.isCreativeMode) {
        event.item.count--
    }

    event.cancel()
})
