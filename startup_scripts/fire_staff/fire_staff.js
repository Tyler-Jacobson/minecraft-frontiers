console.info('Loaded Fire Staff Startup Script')
// priority: 0

const FIRESTAFF_BASE_REPAIR_COST = 1
const FIRESTAFF_BASE_DAMAGE = 17

const finishUsingFireCrystal = (/**@type {Internal.ItemStack}*/itemstack, /**@type {Internal.Level}*/level, /**@type {Internal.Player}*/player) => {
    const { usedItemHand, inventory, lookAngle, eyePosition } = player

    player.addItemCooldown(itemstack.item, 0) // itemcooldown 0 is perfect for gat mode
    player.damageHeldItem(usedItemHand, 1)

    spawnFireball(player, level, eyePosition, lookAngle)

    return itemstack
}

StartupEvents.registry("item", event => {
    event.create("frontiers:fire_staff", 'sword')
        .use((level, player, hand) => {
            playFireStaffSwingAnimation(level, player)
            return true
        })
        .maxDamage(382)
        .finishUsing((itemstack, level, entity) => {
            if (!entity.player) return itemstack
            return finishUsingFireCrystal(itemstack, level, entity) // multiplayer. does this need to be global?
        })
        .releaseUsing((itemstack, level, player) => { // move to animations
            cancelFireStaffSwingAnimation(level, player)
        })
        .useDuration(itemstack => 40) // how many ticks to charge up weapon before calling .finishUsing
        .attackDamageBaseline(1)
})