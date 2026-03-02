BlockEvents.rightClicked(event => {
    if (event.item.id !== 'frontiers:wooden_cleaver') return
    if (event.block.id !== 'frontiers:zombie_crow_carcass') return

    let skinned = event.block.properties.get('skinned')
    if (skinned === 'true') return

    let facing = event.block.properties.get('facing')
    event.block.set('frontiers:zombie_crow_carcass', { facing: facing, skinned: 'true' })

    if (!event.player.isCreativeMode) {
        event.item.damageValue++
    }

    event.cancel()
})
