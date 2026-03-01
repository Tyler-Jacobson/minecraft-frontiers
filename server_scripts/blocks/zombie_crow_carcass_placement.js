BlockEvents.rightClicked(event => {
    if (event.item.id !== 'frontiers:zombie_crow_carcass') return

    if (event.block.id !== 'frontiers:meat_hook') {
        event.cancel()
        return
    }

    let hookFacing = event.block.properties.get('facing')
    event.block.set('frontiers:zombie_crow_carcass', { facing: hookFacing })

    if (!event.player.isCreativeMode) {
        event.item.count--
    }

    event.cancel()
})
