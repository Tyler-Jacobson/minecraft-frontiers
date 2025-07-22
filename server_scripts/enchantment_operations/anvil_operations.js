global.anvilMenuRef = 'something'

PlayerEvents.inventoryOpened('anvil', (event) => {
    global.anvilMenuRef = event
})