ItemEvents.firstLeftClicked("frontiers:scythe", event => {
    console.info('left clicked')
})

// ForgeEvents.onEvent('item.left_click', e => {
//   console.log('item left click')
// })

// ServerEvents.tick(event => {
//     let player = event.getPlayer()
//     player.stopAnimation("bettercombat:two_handed_slash_horizontal_right")
//     player.stopAnimation("bettercombat:two_handed_slash_horizontal_left")
//     player.stopAnimation("bettercombat:scythe_slash")
//     player.stopAnimation("bettercombat:pose_two_handed_scythe")

// })

// PlayerEvents.tick((event) => {
//     let player = event.getPlayer()
//     player.stopAnimation("bettercombat:two_handed_slash_horizontal_right")
//     player.stopAnimation("bettercombat:two_handed_slash_horizontal_left")
//     player.stopAnimation("bettercombat:scythe_slash")
//     player.stopAnimation("bettercombat:pose_two_handed_scythe")
// })