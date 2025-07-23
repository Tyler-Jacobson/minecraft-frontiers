
PlayerEvents.inventoryOpened('anvil', (event) => {
    const player = event.getPlayer()
    global.setPlayerSpecificData(player, 'anvilMenuRef', event)
})