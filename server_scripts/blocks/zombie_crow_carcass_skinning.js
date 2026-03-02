let MAX_SKINNED_STAGE = 4

BlockEvents.rightClicked(event => {
    if (event.item.id !== 'frontiers:wooden_cleaver') return
    if (event.block.id !== 'frontiers:zombie_crow_carcass') return

    let currentStage = parseInt(event.block.properties.get('skinned'))
    if (currentStage >= MAX_SKINNED_STAGE) return

    let facing = event.block.properties.get('facing')
    let nextStage = currentStage + 1
    event.block.set('frontiers:zombie_crow_carcass', { facing: facing, skinned: String(nextStage) })

    if (!event.player.isCreativeMode) {
        event.item.damageValue++
    }

    event.cancel()
})
