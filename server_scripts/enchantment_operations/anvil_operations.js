global.anvilMenuRef = 'something'

PlayerEvents.inventoryOpened('anvil', (event) => {
    // console.info(`opened anvil ${event.getInventoryContainer().addSlotListener}`)
    // global.anvilMenuRef = event.getInventoryContainer()
    global.anvilMenuRef = event
    console.info(`updated anvilMenuRef to ${event}`)
    const forProbe = event.getInventoryContainer().getSlot(2).getItem().nbt.putString()
    const forProbe2 = event.getInventoryContainer().getSlot(2).getItem().getEnchantmentTags()
    const forProbe3 = event.getInventoryContainer().getSlot(2).getItem().appendEnchantmentNames(['Enchantments'], [{ id: "minecraft:power", lvl: 3 }])
})