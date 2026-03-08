BlockEvents.rightClicked(event => {
    let placementBirdConfig = global.HUNTABLE_BIRD_CONSTANTS.find(cfg => cfg.HUNTABLE_BIRD_CARCASS_ID === event.item.id)
    if (!placementBirdConfig) return

    if (event.block.id !== 'frontiers:meat_hook') {
        event.cancel()
        return
    }

    let hookFacing = event.block.properties.get('facing')
    event.block.set(placementBirdConfig.HUNTABLE_BIRD_CARCASS_ID, { facing: hookFacing })

    if (!event.player.isCreativeMode) {
        event.item.count--
    }

    event.cancel()
})
