
PlayerEvents.inventoryOpened('anvil', (event) => {
    const player = event.getPlayer()
    global.setPlayerSpecificData(player, 'anvilMenuRef', event)
    global.anvilMenuRef = event

})

PlayerEvents.inventoryClosed('anvil', (event) => {
    global.anvilMenuRef = 'closedAnvilInv'
})