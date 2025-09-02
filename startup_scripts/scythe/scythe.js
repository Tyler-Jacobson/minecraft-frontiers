StartupEvents.registry("item", event => {
    event.create("frontiers:custom_scythe", 'sword')
        .use((level, player, hand) => {
            // playFireStaffSwingAnimation(level, player)
            return true
        })
        .maxDamage(382)
        .finishUsing((itemstack, level, entity) => {
            if (!entity.player) return itemstack
            // return finishUsingFireCrystal(itemstack, level, entity) // multiplayer. does this need to be global?
        })
        // .releaseUsing((itemstack, level, player) => { // move to animations
        //     cancelFireStaffSwingAnimation(level, player)
        // })
        // .useDuration(itemstack => 40) // how many ticks to charge up weapon before calling .finishUsing
        .attackDamageBaseline(5)
        .speedBaseline(-2.8)
        .modelJson({parent: "frontiers:item/custom_scythe"})
})
// const getFireStaffPowerEnchantmentBonusDamage = (itemStack) => {
//     if (!itemStack.getEnchantments().get('minecraft:power')) {
//         return 0
//     }
//     return itemStack.getEnchantments().get('minecraft:power') * FIRESTAFF_BONUS_DAMAGE_PER_POWER_ENCHANTMENT_LEVEL
// }

// const hasKindnessEnchant = (itemStack) => {
//     if (itemStack.getEnchantments().get('frontiers:kindness')) {
//         return true
//     }
//     return false
// }

// ForgeEvents.onEvent("net.minecraftforge.event.entity.player.PlayerInteractEvent$LeftClickEmpty", event => {
//     let player = event.entity
//     console.log(`item left click ${event.entity}`)
//     console.info(`${player.getAnimation()}`)
//     console.info(`${player.getAnimationStack()}`)
//     // player.getAnimationStack()["removeLayer(dev.kosmx.playerAnim.api.layered.IAnimation)"]
//     // player.stopAnimation(player.getAnimation())

//     // player.triggerAnimation("animationjs:waving")
// })

// if (Platform.isClientEnvironment()) {
//     ClientEvents.init(event => {
//         let $BetterCombatClientEvents = Java.loadClass('net.bettercombat.api.client.BetterCombatClientEvents')
//         let $PlayerAttackStart = Java.loadClass('net.bettercombat.api.client.BetterCombatClientEvents$PlayerAttackStart')
//         $BetterCombatClientEvents.ATTACK_START.register(new JavaAdapter($PlayerAttackStart, {
//             onPlayerAttackStart: function (player, hand) {
//                 // event.cancel()
//                 console.log(`swing event ${event}`)
                
//                 global.playerAttackStart(player, hand)
//             }
//         }))
//     })

//     global.playerAttackStart = (player, hand) => {
//         console.log('test playerattack')
//         player.stopAnimation("bettercombat:two_handed_slash_horizontal_right")
//         player.stopAnimation("bettercombat:two_handed_slash_horizontal_left")
//         player.stopAnimation("bettercombat:scythe_slash")
//         player.stopAnimation("bettercombat:pose_two_handed_scythe")
//         player.sendData('attack_start', {})
//     }
// }