BlockEvents.rightClicked(event => {
    let placementBirdConfig = global.HUNTABLE_BIRD_CONSTANTS.find(cfg => cfg.HUNTABLE_BIRD_CARCASS_ID === event.item.id)
    if (!placementBirdConfig) return
    if (event.block.id === 'frontiers:meat_hook') {
        event.player.swing(event.hand, true)
    }
    event.cancel()
})
