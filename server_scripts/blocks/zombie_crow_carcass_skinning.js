BlockEvents.rightClicked(event => {
    if (event.item.id !== 'frontiers:wooden_cleaver') return
    if (event.block.id !== global.ZOMBIE_CROW_CARCASS_ID) return

    let currentStage = parseInt(event.block.properties.get('skinned'))
    if (currentStage > global.ZOMBIE_CROW_MAX_SKINNED_STAGE) return

    let facing = event.block.properties.get('facing')
    let nextStage = currentStage + 1

    if (Math.random() < 0.4) {
        if (nextStage > global.ZOMBIE_CROW_MAX_SKINNED_STAGE) {
            event.block.set('frontiers:meat_hook', { facing: facing })
            let horizontalFaces = ['north', 'south', 'east', 'west']
            global.ZOMBIE_CROW_CARCASS_DROPS.forEach((drop) => {
                for (let itemIndex = 0; itemIndex < drop.count; itemIndex++) {
                    let randomFace = horizontalFaces[Math.floor(Math.random() * horizontalFaces.length)]
                    event.block.popItemFromFace(Item.of(drop.item, 1), randomFace)
                }
            })
        } else {
            event.block.set(global.ZOMBIE_CROW_CARCASS_ID, { facing: facing, skinned: String(nextStage) })
        }
    }

    if (!event.player.isCreativeMode) {
        event.player.damageHeldItem(event.hand, 1)
    }

    event.cancel()
})
