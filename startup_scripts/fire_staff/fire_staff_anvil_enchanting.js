
const $EnchantmentCategory = Java.loadClass(
    'net.minecraft.world.item.enchantment.EnchantmentCategory'
)
const BuiltInRegistries = Java.loadClass("net.minecraft.core.registries.BuiltInRegistries");


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
        'id': 'frontiers:fire_staff',
        'allowed_enchantments': allowedEnchantsForFireStaff
    },
    {
        'id': 'frontiers:ice_staff',
        'allowed_enchantments': allowedEnchantsForIceStaff
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

let updateCount = 0

ForgeEvents.onEvent('net.minecraftforge.event.AnvilUpdateEvent', (event) => {
    console.info(`updateCount ${updateCount}`)
    updateCount += 1
    try {
        let { left, right, name, cost, player } = event
        // let leftNbt = left.nbt.copy()
        // let anvilMenuData = global.getPlayerSpecificData(player, 'anvilMenuRef')
        // let getOutputItem = anvilMenuData.getInventoryContainer().getSlot(2).getItem()

        // console.info(`leftNbt ${leftNbt}`)



        // if (!(event.getPlayer().level === 'ClientLevel')) {
            if ((left.id === 'frontiers:fire_staff') && (right.id === 'minecraft:enchanted_book' || right.id === 'minecraft:book')) {
                let leftEnchantments = left.getEnchantmentTags()
                let rightEnchantments = right.nbt.StoredEnchantments

                let enchantsConcat = leftEnchantments.concat(rightEnchantments)
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

                // console.info(`output from map ${Object.keys()}`)

                console.info(`left and right ${leftEnchantments} ${rightEnchantments}`)
                console.info(`output array ${outputArray}`)

                // let newFireStaffItem = Item.of('frontiers:fire_staff')
                // let newAir = Item.of('minecraft:air')


                if (outputArray.length) {
                    let newTest = Item.of('frontiers:fire_staff')
                    newTest.nbt.put('Enchantments', outputArray) // working
                    event.setCost(1)
                    event.setOutput(newTest)
                } else {
                    event.setCanceled(true)
                }


                // if (outputItemEnchantsListFiltered.length) {

                //     newFireStaffItem.nbt.put('Enchantments', outputItemEnchantsListFiltered) // working
                //     newFireStaffItem.nbt.putInt('RepairCost', anvilMenuData.getInventoryContainer().calculateIncreasedRepairCost(cost)) // working
                //     // newFireStaffItem.nbt.put('display', left.nbt.get('display') ?? 'nothing') // working
                //     newFireStaffItem.nbt.put('display', { Name: '{"text":"something"}' }) // working

                //     event.setOutput(newFireStaffItem)


                // }
            }
        // }
    } catch (err) {
        let newTest = Item.of('minecraft:chicken')

        event.setOutput(newTest)

        console.error(`Error in Fire Staff ForgeEvents.onEvent AnvilUpdateEvent; ${err}`)
    }


})

// ForgeEvents.onEvent('net.minecraftforge.event.AnvilUpdateEvent', (event) => {
//     let { left, right, name, cost, player, output } = event
//     // if (right.nbt) {
//     //     right.nbt.put('Enchantments', [{ id: "minecraft:unbreaking", lvl: 2 }, { id: "minecraft:mending", lvl: 1 }])
//     // }
//     event.setMaterialCost(0)
//     // console.info(`cost ${cost}`)
//     // console.info(`left and right ${left} ${right}`)
//     // console.info(`output ${output}`)

//     // console.info(`event was canceled ${event.isCanceled()} ${event.isCancelable()}`)


//     // if (!(event.getPlayer().level === 'ClientLevel')) {
//     // let newTest = Item.of('minecraft:gold_ingot')
//     // newTest.nbt.putInt('RepairCost', 1) // working
//     event.setCost(13)

//     event.setOutput(left)
//     // event.setCanceled(true)
//     // console.info(`event was canceled ${event.isCanceled()} ${event.isCancelable()}`)

//     // console.info(`output2 ${output} | ${event.getOutput()}`)
//     // }
    


// })
