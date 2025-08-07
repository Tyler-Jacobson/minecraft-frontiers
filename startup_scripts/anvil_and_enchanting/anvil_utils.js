const BuiltInRegistries = Java.loadClass("net.minecraft.core.registries.BuiltInRegistries");

const enchantsConcatToOutputArray = ((enchantsConcat, allowedEnchantsForItem) => {
    let outputEnchantsMap = new Map()

    enchantsConcat.forEach(enchant => { // if the enchant is not in the map yet
        const forgeRegistryEnch = BuiltInRegistries.ENCHANTMENT.entrySet().find(enchantmentRegistryEntry => {
            return enchantmentRegistryEntry.key.location() === enchant.id
        })
        if (!allowedEnchantsForItem.includes(enchant.id)) {
            return
        }
        if (!outputEnchantsMap.get(enchant.id)) {
            outputEnchantsMap.set(enchant.id, enchant.lvl)
        } else if ((outputEnchantsMap.get(enchant.id) === enchant.lvl) && !(enchant.lvl >= forgeRegistryEnch.value.getMaxLevel())) { // if the enchant in the map already is the same level as the current one
            outputEnchantsMap.set(enchant.id, enchant.lvl + 1)
        } else if (enchant.lvl > outputEnchantsMap.get(enchant.id)) {
            outputEnchantsMap.set(enchant.id, enchant.lvl)
        }
    })
    let outputArray = []
    outputEnchantsMap.forEach((value, key) => {
        outputArray.push({ id: key, lvl: value })
    })
    return outputArray
})

const addNbtDataToItem = (newItem, left, increasedRepairCost, outputArray, newItemName) => {
    newItem.nbt.put('Enchantments', outputArray)
    let increasedRepairCostWithNameCheck = increasedRepairCost

    if (newItemName) {
        newItem.nbt.put('display', { Name: `{"text":"${newItemName}"}` })
        increasedRepairCostWithNameCheck = increasedRepairCost + 1
    } else if (left.nbt.get('display')) {
        newItem.nbt.put('display', left.nbt.get('display'))
    }
    newItem.nbt.putInt('RepairCost', increasedRepairCostWithNameCheck)
    newItem.nbt.putInt('Damage', left.nbt.getInt('Damage'))
    return newItem
}