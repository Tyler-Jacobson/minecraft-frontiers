
const $EnchantmentCategory = Java.loadClass(
    'net.minecraft.world.item.enchantment.EnchantmentCategory'
)
const BuiltInRegistries = Java.loadClass("net.minecraft.core.registries.BuiltInRegistries");
const $AnvilMenu = Java.loadClass("net.minecraft.world.inventory.AnvilMenu")


const allowedEnchantsForFireStaff = [
    "minecraft:power",
    "minecraft:unbreaking",
    "minecraft:mending",
    "frontiers:kindness"
]

const allowedEnchantsForIceStaff = [
    "minecraft:power",
    "minecraft:unbreaking",
    "minecraft:mending",
    "minecraft:quickdraw"
]

const customItemEnchantmentDefinitions = [
    {
        id: 'frontiers:fire_staff',
        allowed_enchantments: allowedEnchantsForFireStaff
    },
    {
        // id: 'frontiers:ice_staff',
        id: 'minecraft:gold_sword',
        allowed_enchantments: allowedEnchantsForIceStaff
    }
]

StartupEvents.registry("enchantment", (event) => {
    event.create('frontiers:kindness')
        .minLevel(1)
        .maxLevel(1)
        .category(
            $EnchantmentCategory.create('fire_staff', (i) => {
                return i.id == 'frontiers:fire_staff'
            })
        )
        .canEnchant((/** @type {Internal.ItemStack} */ i) => {
            return i.id == 'frontiers:fire_staff' || i.id == 'minecraft:book' // this works
        })
        .minCost((level) => {
            return 15
        })
        .maxCost((level) => {
            return 31
        })
        .rarity('uncommon')
        .displayName('Kindness')
})

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

ForgeEvents.onEvent('net.minecraftforge.event.AnvilUpdateEvent', (event) => {
    try {
        let { left, right, name, cost, player } = event
        customItemEnchantmentDefinitions.forEach(itemDefinition => {
            if ((left.id === itemDefinition.id) && (right.id === 'minecraft:enchanted_book')) {
                let leftEnchantments = left.getEnchantmentTags() ?? []
                let rightEnchantments = right?.nbt?.StoredEnchantments ?? []

                let enchantsConcat = leftEnchantments.concat(rightEnchantments)
                let outputArray = enchantsConcatToOutputArray(enchantsConcat, itemDefinition.allowed_enchantments)
                let increasedRepairCost = $AnvilMenu.calculateIncreasedRepairCost(cost) ?? 1


                if (outputArray.length) {
                    let newItem = Item.of(itemDefinition.id)
                    let newItemWithNbt = addNbtDataToItem(newItem, left, increasedRepairCost, outputArray, name)
                    // setCost IS NOT SET BY DEFAULT IN THE FORGE CONSTRUCTOR. FAILING TO SET THIS VALUE ABOVE ZERO WILL BREAK ENCHANT OPERATIONS WITH TOO LOW OF A BASE ENCHANT COST
                    event.setCost(newItemWithNbt.nbt.getInt('RepairCost'))
                    event.setOutput(newItemWithNbt)
                } else {
                    // if there are no valid enchantments for the combination of items, or if the cost is too expensive, cancel the event (set the output to nothing)
                    event.setCanceled(true)
                }
            }
            if ((left.id === itemDefinition.id) && (right.id === itemDefinition.id)) {
                let leftEnchantments = left.getEnchantmentTags() ?? []
                let rightEnchantments = right.getEnchantmentTags() ?? []

                let enchantsConcat = leftEnchantments.concat(rightEnchantments)
                let outputArray = enchantsConcatToOutputArray(enchantsConcat, itemDefinition.allowed_enchantments)

                if (outputArray.length) {
                    let newItem = Item.of(itemDefinition.id)
                    let increasedRepairCost = $AnvilMenu.calculateIncreasedRepairCost(cost) ?? 1
                    let newItemWithNbt = addNbtDataToItem(newItem, left, increasedRepairCost, outputArray, name)

                    event.setCost(increasedRepairCost)
                    event.setOutput(newItemWithNbt)
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