StartupEvents.registry("item", event => {
    global.HUNTABLE_BIRD_CONSTANTS.forEach(birdConfig => {
        event.create(birdConfig.HUNTABLE_BIRD_BAIT_ID, 'basic')
            .texture('layer0', birdConfig.HUNTABLE_BIRD_BAIT_TEXTURE)
            .use((level, player, hand) => {
                console.info('using bait')
                player.swing()
                // level.playSound(player, player.block.pos, 'minecraft:entity.egg.throw', "players", 0.5, 0.33-0.5)

                return true
            })
            .finishUsing((itemstack, level, entity) => {
                // console.info(`finish using hatchling ${itemstack} ${level} ${entity.player}`)
                if (!entity.player) return itemstack

                return global.finishUsingHuntableBirdBait(itemstack, level, entity) // multiplayer. does this need to be global?
                // how many ticks to charge up weapon before calling .finishUsing
            }).useDuration(itemstack => 1)
    })
})

global.finishUsingHuntableBirdBait = (itemstack, level, player) => {
    const { usedItemHand, inventory, lookAngle, eyePosition } = player

    player.addItemCooldown(itemstack.item, 1) // itemcooldown 0 is perfect for gat mode

    let baitBirdConfig = global.HUNTABLE_BIRD_CONSTANTS.find(cfg => cfg.HUNTABLE_BIRD_BAIT_ID === itemstack.id)
    if (baitBirdConfig) {
        global.spawnHuntableBird(player, level, eyePosition, baitBirdConfig)
    }

    itemstack.shrink(1)
    return itemstack
}

global.spawnHuntableBird = (player, level, eyePosition, birdConfig) => {
    let entity = level.createEntity(birdConfig.HUNTABLE_BIRD_ID);
    if (!entity) {
        return
    }
    // it's crucial to set the projectile entity's owner here, since we're later going to reference this in order to get the damage source
    // projectile.setOwner(player)
    // const vel = lookAngle.scale(3)

    let lookVector = player.getLookAngle().scale(3)
    let playerPosition = player.position()
    let targetLocation = playerPosition.add(lookVector)
    // projectile.setMotion(vel.x(), vel.y() + 0.1, vel.z())
    entity.setPosition(targetLocation.x(), targetLocation.y() + 15, targetLocation.z())
    entity.setSyncedData('currentPhase', 0)
    entity.setSyncedData('isFleeing', false)
    entity.setSyncedData('orbitalDestinationIndex', 0)
    entity.setNoGravity(true)
    entity.spawn()
}