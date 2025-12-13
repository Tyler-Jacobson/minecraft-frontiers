StartupEvents.registry("item", event => {
  event.create("frontiers:custom_scythe", 'sword')
    .use((level, player, hand) => {
      // playFireStaffSwingAnimation(level, player)
      return false
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
    .modelJson({ parent: "frontiers:item/custom_scythe" })
})

if (Platform.isClientEnvironment()) {
  ClientEvents.init(event => {
    let $BetterCombatClientEvents = Java.loadClass('net.bettercombat.api.client.BetterCombatClientEvents')
    let $PlayerAttackStart = Java.loadClass('net.bettercombat.api.client.BetterCombatClientEvents$PlayerAttackStart') // there is also a BetterCombatClientEvents$PlayerAttackHit event
    // if (event.getPlayer().getMainHandItem())
    $BetterCombatClientEvents.ATTACK_START.register(new JavaAdapter($PlayerAttackStart, {
      onPlayerAttackStart: function (player, hand) {
        // this sends a packet from client to server on the better_combat_scythe_attack_started channel to say an attack has started
        player.sendData('better_combat_scythe_attack_started', { attack_started: true })

      }
    }))
  })
}