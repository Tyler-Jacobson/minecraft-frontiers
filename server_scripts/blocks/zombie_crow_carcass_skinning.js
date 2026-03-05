BlockEvents.rightClicked(event => {
    if (event.item.id !== 'frontiers:wooden_cleaver') return
    if (event.block.id !== global.ZOMBIE_CROW_CARCASS_ID) return

    let currentStage = parseInt(event.block.properties.get('skinned'))
    if (currentStage >= global.ZOMBIE_CROW_MAX_SKINNED_STAGE) return

    let facing = event.block.properties.get('facing')
    let nextStage = currentStage + 1

    if (Math.random() < 0.4) {
        event.block.set(global.ZOMBIE_CROW_CARCASS_ID, { facing: facing, skinned: String(nextStage) })
    }

    if (!event.player.isCreativeMode) {
        event.player.damageHeldItem(event.hand, 1)
    }

    event.cancel()
})
