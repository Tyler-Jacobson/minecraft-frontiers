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

const customItemEnchantmentDefinitions = [ // determines which enchantments can be added to an item through the anvil
    {
        id: 'frontiers:fire_staff',
        allowed_enchantments: allowedEnchantsForFireStaff
    },
    {
        // id: 'frontiers:ice_staff',
        id: 'frontiers:ice_staff',
        allowed_enchantments: allowedEnchantsForIceStaff
    }
]

StartupEvents.registry("enchantment", (event) => { // registers custom enchantments
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