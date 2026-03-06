BlockEvents.rightClicked(event => {
    if (event.item.id !== 'frontiers:wooden_cleaver') return
    if (event.block.id !== global.HUNTABLE_BIRD_CONSTANTS.HUNTABLE_BIRD_CARCASS_ID) return

    let currentStage = parseInt(event.block.properties.get('skinned'))
    if (currentStage > global.HUNTABLE_BIRD_CONSTANTS.HUNTABLE_BIRD_MAX_SKINNED_STAGE) return

    event.player.swing(event.hand, true)
    event.cancel()
})
