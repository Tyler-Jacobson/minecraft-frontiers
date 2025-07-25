
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
        id: 'frontiers:ice_staff',
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

const enchantsConcatToOutputArray = (enchantsConcat => {
    let outputEnchantsMap = new Map()

    console.info(`enchants concat ${enchantsConcat}`)

    enchantsConcat.forEach(enchant => { // if the enchant is not in the map yet
        const forgeRegistryEnch = BuiltInRegistries.ENCHANTMENT.entrySet().find(enchantmentRegistryEntry => {
            // console.info(`enchantmentRegistryEntry.key.location() ${enchantmentRegistryEntry.key.location()}`)
            return enchantmentRegistryEntry.key.location() === enchant.id
        })
        if (!allowedEnchantsForFireStaff.includes(enchant.id)) {
            console.info(`stop zero ${enchant.id} lvl ${enchant.lvl}`)
            return
        }
        if (!outputEnchantsMap.get(enchant.id)) {
            console.info(`first stop ${enchant.id} lvl ${enchant.lvl}`)
            outputEnchantsMap.set(enchant.id, enchant.lvl)
        } else if ((outputEnchantsMap.get(enchant.id) === enchant.lvl) && !(enchant.lvl >= forgeRegistryEnch.value.getMaxLevel())) { // if the enchant in the map already is the same level as the current one
            console.info(`second stop ${enchant.id} lvl ${enchant.lvl} maxLvl: ${forgeRegistryEnch.value.getMaxLevel()}`)
            outputEnchantsMap.set(enchant.id, enchant.lvl + 1)
        } else if (enchant.lvl > outputEnchantsMap.get(enchant.id)) {
            console.info(`third stop ${enchant.id} lvl ${enchant.lvl}`)
            outputEnchantsMap.set(enchant.id, enchant.lvl)
        } else {
            console.info(`failed to hit second and third layers of the map for id ${enchant.id} with level ${enchant.lvl} which already has ${outputEnchantsMap.get(enchant.id)} with lvl ${outputEnchantsMap.get(enchant.id).lvl} in the map`)
        }
        console.info(`maxLvl: ${forgeRegistryEnch.value.getMaxLevel()}`)
    })
    let outputArray = []
    outputEnchantsMap.forEach((value, key) => {
        console.info(`forEach ${key} = ${value}`)
        outputArray.push({ id: key, lvl: value })
    })
    return outputArray
})

const addNbtDataToItem = (newItem, left, increasedRepairCost, outputArray) => {
    newItem.nbt.put('Enchantments', outputArray) // working
    if (left.nbt.get('display')) {
        console.info(`display: ${left.nbt.get('display')}`)
        newItem.nbt.put('display', left.nbt.get('display')) // working

    }
    newItem.nbt.putInt('RepairCost', increasedRepairCost) // working
    newItem.nbt.putInt('Damage', left.nbt.getInt('Damage')) // working
    return newItem
}

ForgeEvents.onEvent('net.minecraftforge.event.AnvilUpdateEvent', (event) => {
    try {
        let { left, right, name, cost, player } = event
        // let leftNbt = left.nbt.copy()
        // let anvilMenuData = global.getPlayerSpecificData(player, 'anvilMenuRef')
        // let getOutputItem = anvilMenuData.getInventoryContainer().getSlot(2).getItem()

        // console.info(`leftNbt ${leftNbt}`)
        console.info(`cost ${cost}`)
        console.info(`$AnvilMenu.calculateIncreasedRepairCost() ${$AnvilMenu.calculateIncreasedRepairCost(cost)}`)

        if ((left.id === 'frontiers:fire_staff') && (right.id === 'minecraft:enchanted_book')) {
            let leftEnchantments = left.getEnchantmentTags() ?? []
            let rightEnchantments = right?.nbt?.StoredEnchantments ?? []

            let enchantsConcat = leftEnchantments.concat(rightEnchantments)
            // let outputEnchantsMap = new Map()

            // console.info(`enchants concat ${enchantsConcat}`)

            // enchantsConcat.forEach(enchant => { // if the enchant is not in the map yet
            //     const forgeRegistryEnch = BuiltInRegistries.ENCHANTMENT.entrySet().find(enchantmentRegistryEntry => {
            //         // console.info(`enchantmentRegistryEntry.key.location() ${enchantmentRegistryEntry.key.location()}`)
            //         return enchantmentRegistryEntry.key.location() === enchant.id
            //     })
            //     if (!allowedEnchantsForFireStaff.includes(enchant.id)) {
            //         console.info(`stop zero ${enchant.id} lvl ${enchant.lvl}`)
            //         return
            //     }
            //     if (!outputEnchantsMap.get(enchant.id)) {
            //         console.info(`first stop ${enchant.id} lvl ${enchant.lvl}`)
            //         outputEnchantsMap.set(enchant.id, enchant.lvl)
            //     } else if ((outputEnchantsMap.get(enchant.id) === enchant.lvl) && !(enchant.lvl >= forgeRegistryEnch.value.getMaxLevel())) { // if the enchant in the map already is the same level as the current one
            //         console.info(`second stop ${enchant.id} lvl ${enchant.lvl} maxLvl: ${forgeRegistryEnch.value.getMaxLevel()}`)
            //         outputEnchantsMap.set(enchant.id, enchant.lvl + 1)
            //     } else if (enchant.lvl > outputEnchantsMap.get(enchant.id)) {
            //         console.info(`third stop ${enchant.id} lvl ${enchant.lvl}`)
            //         outputEnchantsMap.set(enchant.id, enchant.lvl)
            //     } else {
            //         console.info(`failed to hit second and third layers of the map for id ${enchant.id} with level ${enchant.lvl} which already has ${outputEnchantsMap.get(enchant.id)} with lvl ${outputEnchantsMap.get(enchant.id).lvl} in the map`)
            //     }
            //     console.info(`maxLvl: ${forgeRegistryEnch.value.getMaxLevel()}`)
            // })
            // let outputArray = []
            // outputEnchantsMap.forEach((value, key) => {
            //     console.info(`forEach ${key} = ${value}`)
            //     outputArray.push({ id: key, lvl: value })
            // })
            let outputArray = enchantsConcatToOutputArray(enchantsConcat)

            if (outputArray.length) {
                let newItem = Item.of('frontiers:fire_staff')
                let increasedRepairCost = $AnvilMenu.calculateIncreasedRepairCost(cost) ?? 1
                // newTest.nbt.put('Enchantments', outputArray) // working

                // setCost IS NOT SET BY DEFAULT IN THE FORGE CONSTRUCTOR. FAILING TO SET THIS VALUE ABOVE ZERO WILL BREAK ENCHANT OPERATIONS WITH TOO LOW OF A BASE ENCHANT COST
                let newItemWithNbt = addNbtDataToItem(newItem, left, increasedRepairCost, outputArray)
                event.setCost(increasedRepairCost)
                // newTest.nbt.put('Enchantments', outputArray) // working
                // if (left.nbt.get('display')) {
                //     console.info(`display: ${left.nbt.get('display')}`)
                //     newTest.nbt.put('display', left.nbt.get('display')) // working

                // }
                // newTest.nbt.putInt('RepairCost', increasedRepairCost) // working

                event.setOutput(newItemWithNbt)
            } else {
                // if there are no valid enchantments for the combination of items, cancel the event (set the output to nothing)
                event.setCanceled(true)
            }
        }
        if ((left.id === 'frontiers:fire_staff') && (right.id === 'frontiers:fire_staff')) {
            let leftEnchantments = left.getEnchantmentTags() ?? []
            let rightEnchantments = right.getEnchantmentTags() ?? []

            let enchantsConcat = leftEnchantments.concat(rightEnchantments)
            // let outputEnchantsMap = new Map()

            // console.info(`enchants concat ${enchantsConcat}`)

            // enchantsConcat.forEach(enchant => { // if the enchant is not in the map yet
            //     const forgeRegistryEnch = BuiltInRegistries.ENCHANTMENT.entrySet().find(enchantmentRegistryEntry => {
            //         // console.info(`enchantmentRegistryEntry.key.location() ${enchantmentRegistryEntry.key.location()}`)
            //         return enchantmentRegistryEntry.key.location() === enchant.id
            //     })
            //     if (!allowedEnchantsForFireStaff.includes(enchant.id)) {
            //         console.info(`stop zero ${enchant.id} lvl ${enchant.lvl}`)
            //         return
            //     }
            //     if (!outputEnchantsMap.get(enchant.id)) {
            //         console.info(`first stop ${enchant.id} lvl ${enchant.lvl}`)
            //         outputEnchantsMap.set(enchant.id, enchant.lvl)
            //     } else if ((outputEnchantsMap.get(enchant.id) === enchant.lvl) && !(enchant.lvl >= forgeRegistryEnch.value.getMaxLevel())) { // if the enchant in the map already is the same level as the current one
            //         console.info(`second stop ${enchant.id} lvl ${enchant.lvl} maxLvl: ${forgeRegistryEnch.value.getMaxLevel()}`)
            //         outputEnchantsMap.set(enchant.id, enchant.lvl + 1)
            //     } else if (enchant.lvl > outputEnchantsMap.get(enchant.id)) {
            //         console.info(`third stop ${enchant.id} lvl ${enchant.lvl}`)
            //         outputEnchantsMap.set(enchant.id, enchant.lvl)
            //     } else {
            //         console.info(`failed to hit second and third layers of the map for id ${enchant.id} with level ${enchant.lvl} which already has ${outputEnchantsMap.get(enchant.id)} with lvl ${outputEnchantsMap.get(enchant.id).lvl} in the map`)
            //     }
            //     console.info(`maxLvl: ${forgeRegistryEnch.value.getMaxLevel()}`)
            // })
            // let outputArray = []
            // outputEnchantsMap.forEach((value, key) => {
            //     console.info(`forEach ${key} = ${value}`)
            //     outputArray.push({ id: key, lvl: value })
            // })
            let outputArray = enchantsConcatToOutputArray(enchantsConcat)

            if (outputArray.length) {
                let newItem = Item.of('frontiers:fire_staff')
                let increasedRepairCost = $AnvilMenu.calculateIncreasedRepairCost(cost) ?? 1

                // newTest.nbt.put('Enchantments', outputArray) // working

                // setCost IS NOT SET BY DEFAULT IN THE FORGE CONSTRUCTOR. FAILING TO SET THIS VALUE ABOVE ZERO WILL BREAK ENCHANT OPERATIONS WITH TOO LOW OF A BASE ENCHANT COST

                // newTest.nbt.put('Enchantments', outputArray) // working
                // if (left.nbt.get('display')) {
                //     console.info(`display: ${left.nbt.get('display')}`)
                //     newTest.nbt.put('display', left.nbt.get('display')) // working

                // }
                // newTest.nbt.putInt('RepairCost', increasedRepairCost) // working
                // newTest.nbt.putInt('Damage', modifiedInputItemNBTData.getInt('Damage')) // working

                let newItemWithNbt = addNbtDataToItem(newItem, left, increasedRepairCost, outputArray)

                event.setCost(increasedRepairCost)
                event.setOutput(newItemWithNbt)
            } else {
                event.setCanceled(true)
            }
        }
    } catch (err) {
        let newTest = Item.of('minecraft:chicken')

        event.setOutput(newTest)

        console.error(`Error in Fire Staff ForgeEvents.onEvent AnvilUpdateEvent; ${err}`)
    }


})