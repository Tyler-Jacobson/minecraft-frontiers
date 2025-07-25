const $AnvilMenu = Java.loadClass("net.minecraft.world.inventory.AnvilMenu")

const handleItemRepair = (left, right) => {
    // fully repaired is represented as getDamageValue() === 0
    if (!left.isDamaged()) {
        return left
    }
    let repairBonus = left.getMaxDamage() * 0.12
    let leftDamage = left.getMaxDamage() - left.getDamageValue()
    let rightDamage = right.getMaxDamage() - right.getDamageValue()
    let finalRepairDamageValue = left.getMaxDamage() - (leftDamage + rightDamage + repairBonus)
    if (0 > finalRepairDamageValue) {
        left.setDamageValue(0)
        return left
    } else {
        left.setDamageValue(finalRepairDamageValue)
        return left
    }
}

ForgeEvents.onEvent('net.minecraftforge.event.AnvilUpdateEvent', (event) => {
    try {
        // left and right are the two input slots. Name is the name of the item as determined by the anvil's text input. Cost is the existing known repair cost of the item
        let { left, right, name, cost, player } = event
        // loop my list of items with custom anvil interactions, defined in enchantment_registry.js looking for a match
        customItemEnchantmentDefinitions.forEach(itemDefinition => {
            if ((left.id === itemDefinition.id) && (right.id === 'minecraft:enchanted_book')) {
                // get list of enchantments for left and right items
                let leftEnchantments = left.getEnchantmentTags() ?? []
                let rightEnchantments = right?.nbt?.StoredEnchantments ?? []

                // combine left and right enchantments list, then use enchantsConcatToOutputArray, which is a full override of anvil logic
                let enchantsConcat = leftEnchantments.concat(rightEnchantments)
                let viableEnchantsList = enchantsConcatToOutputArray(enchantsConcat, itemDefinition.allowed_enchantments)
                // calculate the increase to repair cost from a static method on the $AnvilMenu Java class. Default to 1. If this is ever 0, the anvil breaks
                let increasedRepairCost = $AnvilMenu.calculateIncreasedRepairCost(cost) ?? 1

                // if we have any enchantments which can be applied to the item, do this, otherwise cancel the event
                if (viableEnchantsList.length) {
                    // create a new item of the same type as the input item
                    let newItem = Item.of(itemDefinition.id)
                    // add nbt data from the existing item
                    // this includes display name, durability, total repair cost, and the new list of viableEnchantsList instead of the old enchantments
                    let newItemWithNbt = addNbtDataToItem(newItem, left, increasedRepairCost, viableEnchantsList, name)
                    // setCost IS NOT SET BY DEFAULT IN THE FORGE CONSTRUCTOR. FAILING TO SET THIS VALUE ABOVE ZERO WILL BREAK ENCHANT OPERATIONS WITH TOO LOW OF A BASE ENCHANT COST
                    // THIS WILL PREVENT THE USER FROM TAKING THE ITEM OUT OF THE ANVIL, AND DISPLAY NO ERRORS
                    event.setCost(newItemWithNbt.nbt.getInt('RepairCost'))
                    // set the output
                    event.setOutput(newItemWithNbt)
                } else {
                    // if there are no valid enchantments for the combination of items, or if the cost is too expensive, cancel the event (set the output to nothing)
                    event.setCanceled(true)
                }
            }
            // do the same thing again, but for instances of item + item instead of item + enchanted_book
            if ((left.id === itemDefinition.id) && (right.id === itemDefinition.id)) {
                let leftEnchantments = left.getEnchantmentTags() ?? []
                let rightEnchantments = right.getEnchantmentTags() ?? []

                let enchantsConcat = leftEnchantments.concat(rightEnchantments)
                let viableEnchantsList = enchantsConcatToOutputArray(enchantsConcat, itemDefinition.allowed_enchantments)
                console.info(`isDamaged() ${left.isDamaged()} ${left.getMaxDamage()}`)
                if (viableEnchantsList.length || left.isDamaged()) {
                    let newItem = Item.of(itemDefinition.id)
                    let increasedRepairCost = $AnvilMenu.calculateIncreasedRepairCost(cost) ?? 1
                    let newItemWithNbt = addNbtDataToItem(newItem, left, increasedRepairCost, viableEnchantsList, name)

                    let repairedNewItemWithNbt = handleItemRepair(newItemWithNbt, right)
                    event.setCost(increasedRepairCost)
                    event.setOutput(repairedNewItemWithNbt)
                } else {
                    event.setCanceled(true)
                }
            }
        })

    } catch (err) {
        let debugItem = Item.of('minecraft:chicken')
        event.setOutput(debugItem)
        console.error(`Error in Fire Staff ForgeEvents.onEvent AnvilUpdateEvent; ${err}`)
    }
})