BlockEvents.broken(event => {
    let brokenBirdConfig = global.HUNTABLE_BIRD_CONSTANTS.find(cfg => cfg.HUNTABLE_BIRD_EGG_ID === event.block.id)
    if (!brokenBirdConfig) return

    let horizontalFaces = ['north', 'south', 'east', 'west']
    brokenBirdConfig.HUNTABLE_BIRD_EGG_DROPS.forEach(drop => {
        for (let itemIndex = 0; itemIndex < drop.count; itemIndex++) {
            let randomFace = horizontalFaces[Math.floor(Math.random() * horizontalFaces.length)]
            event.block.popItemFromFace(Item.of(drop.item, 1), randomFace)
        }
    })
})
