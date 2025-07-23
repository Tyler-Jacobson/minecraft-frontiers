
const $EnchantmentCategory = Java.loadClass(
    'net.minecraft.world.item.enchantment.EnchantmentCategory'
)

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

ForgeEvents.onEvent('net.minecraftforge.event.AnvilUpdateEvent', (event) => {
    try {
        let { left, right, name, cost, player } = event
        let modifiedInputItemNBTData = left.nbt.copy()

        if (!(event.getPlayer().level === 'ClientLevel')) {
            if ((left.id === 'frontiers:fire_staff') && (right.id === 'minecraft:enchanted_book')) {

                let anvilMenuData = global.getPlayerSpecificData(player, 'anvilMenuRef')
                let getOutputItem = anvilMenuData.getInventoryContainer().getSlot(2).getItem()

                let outputItemEnchantmentsCopy = getOutputItem.getEnchantmentTags().copy()
                let outputItemEnchantsList = outputItemEnchantmentsCopy.filter(enchantment => allowedEnchantsForFireStaff.includes(enchantment.id))


                let newFireStaffItem = Item.of('frontiers:fire_staff')
                if (outputItemEnchantsList.length) {
                    newFireStaffItem.nbt.putInt('Damage', modifiedInputItemNBTData.getInt('Damage')) // working
                    newFireStaffItem.nbt.putInt('RepairCost', anvilMenuData.getInventoryContainer().calculateIncreasedRepairCost(cost)) // working
                    newFireStaffItem.nbt.put('Enchantments', outputItemEnchantsList) // working
                    if (left.nbt.get('display')) {
                        newFireStaffItem.nbt.put('display', left.nbt.get('display')) // working
                    }
                    event.setOutput(newFireStaffItem)
                }
            }
        }
    } catch (err) {
        console.error(`Error in Fire Staff ForgeEvents.onEvent AnvilUpdateEvent; ${err}`)
    }
})

