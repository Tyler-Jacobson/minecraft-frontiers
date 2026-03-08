BlockEvents.rightClicked(event => {
    if (event.item.id !== 'frontiers:wooden_cleaver') return

    let skinningBirdConfig = global.HUNTABLE_BIRD_CONSTANTS.find(cfg => cfg.HUNTABLE_BIRD_CARCASS_ID === event.block.id)
    if (!skinningBirdConfig) return

    let currentStage = parseInt(event.block.properties.get('skinned'))
    if (currentStage > skinningBirdConfig.HUNTABLE_BIRD_MAX_SKINNED_STAGE) return

    event.player.swing(event.hand, true)
    event.cancel()
})
