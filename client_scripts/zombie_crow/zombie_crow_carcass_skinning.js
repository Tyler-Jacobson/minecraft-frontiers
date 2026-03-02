BlockEvents.rightClicked(event => {
    if (event.item.id !== 'frontiers:wooden_cleaver') return
    if (event.block.id !== 'frontiers:zombie_crow_carcass') return

    let skinned = event.block.properties.get('skinned')
    if (skinned === 'true') return

    event.player.swing(event.hand, true)
    event.cancel()
})
