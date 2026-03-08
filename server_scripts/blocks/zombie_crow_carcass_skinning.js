BlockEvents.rightClicked(event => {
    if (event.item.id !== 'frontiers:wooden_cleaver') return

    let skinningBirdConfig = global.HUNTABLE_BIRD_CONSTANTS.find(cfg => cfg.HUNTABLE_BIRD_CARCASS_ID === event.block.id)
    if (!skinningBirdConfig) return

    let currentStage = parseInt(event.block.properties.get('skinned'))
    if (currentStage > skinningBirdConfig.HUNTABLE_BIRD_MAX_SKINNED_STAGE) return

    event.server.runCommandSilent(`playsound ${skinningBirdConfig.HUNTABLE_BIRD_SKINNING_SOUND} player ${event.player.username} ${event.block.x} ${event.block.y} ${event.block.z} 1 1`)

    let facing = event.block.properties.get('facing')
    let nextStage = currentStage + 1

    if (Math.random() < 0.4) {
        if (nextStage > skinningBirdConfig.HUNTABLE_BIRD_MAX_SKINNED_STAGE) {
            event.block.set('frontiers:meat_hook', { facing: facing })
            let horizontalFaces = ['north', 'south', 'east', 'west']
            skinningBirdConfig.HUNTABLE_BIRD_CARCASS_DROPS.forEach((drop) => {
                for (let itemIndex = 0; itemIndex < drop.count; itemIndex++) {
                    let randomFace = horizontalFaces[Math.floor(Math.random() * horizontalFaces.length)]
                    event.block.popItemFromFace(Item.of(drop.item, 1), randomFace)
                }
            })
        } else {
            event.block.set(skinningBirdConfig.HUNTABLE_BIRD_CARCASS_ID, { facing: facing, skinned: String(nextStage) })
        }
    }

    if (!event.player.isCreativeMode) {
        event.player.damageHeldItem(event.hand, 1)
    }

    event.cancel()
})
