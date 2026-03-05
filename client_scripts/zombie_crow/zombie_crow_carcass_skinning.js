let MAX_SKINNED_STAGE = 4

BlockEvents.rightClicked(event => {
    if (event.item.id !== 'frontiers:wooden_cleaver') return
    if (event.block.id !== global.ZOMBIE_CROW_CARCASS_ID) return

    let currentStage = parseInt(event.block.properties.get('skinned'))
    if (currentStage >= MAX_SKINNED_STAGE) return

    event.player.swing(event.hand, true)
    event.cancel()
})
