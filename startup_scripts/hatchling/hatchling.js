StartupEvents.registry("item", event => {
    event.create("frontiers:hatchling", 'basic')
        .use((level, player, hand) => {
            console.info('using hatchling')
            player.swing()
            level.playSound(player, player.block.pos, 'minecraft:entity.egg.throw', "players", 0.5, 0.33-0.5)

            return true
        })
        .finishUsing((itemstack, level, entity) => {
            // console.info(`finish using hatchling ${itemstack} ${level} ${entity.player}`)
            if (!entity.player) return itemstack

            return finishUsingHatchling(itemstack, level, entity) // multiplayer. does this need to be global?
            // how many ticks to charge up weapon before calling .finishUsing
        }).useDuration(itemstack => 1)
})

const finishUsingHatchling = (/**@type {Internal.ItemStack}*/itemstack, /**@type {Internal.Level}*/level, /**@type {Internal.Player}*/player) => {
    const { usedItemHand, inventory, lookAngle, eyePosition } = player

    player.addItemCooldown(itemstack.item, 0) // itemcooldown 0 is perfect for gat mode
    // player.damageHeldItem(usedItemHand, 1) // instead reduce hand count by 1

    spawnHatchlingEntity(player, level, eyePosition, lookAngle)

    return itemstack
}

const spawnHatchlingEntity = (player, level, eyePosition, lookAngle) => {
    const projectile = level.createEntity("frontiers:hatchling_projectile");
    // console.info('spawning projectile')
    // it's crucial to set the projectile entity's owner here, since we're later going to reference this in order to get the damage source
    projectile.setOwner(player)
    const vel = lookAngle.scale(3)
    projectile.setMotion(vel.x(), vel.y(), vel.z())
    projectile.setPosition(eyePosition.x(), eyePosition.y(), eyePosition.z())
    projectile.setNoGravity(false)
    projectile.spawn()
}