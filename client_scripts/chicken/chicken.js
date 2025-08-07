ClientEvents.tick(event => {
    let player = event.getPlayer()
    let level = event.getPlayer().getLevel()
    if (global.getPlayerSpecificData(player, 'shouldPlayShearChickenSound')) {
        level.playSound(player, player.block.pos, 'entity.sheep.shear', "players", 1, 1)
        global.setPlayerSpecificData(player, 'shouldPlayShearChickenSound', false)

    }
})