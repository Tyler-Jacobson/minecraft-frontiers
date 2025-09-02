console.info('Hello, Scythe! (Loaded client scripts)')


// AnimationJS.handRenderer(event => {
//     const { poseStack, player } = event
//     console.info(`rendering hand`)
//     if (player.isCrouching()) {
//         // Apply a transformation to the hand when the player is crouching
//         console.info(`transforming hand`)
//         poseStack.translate(0, -2, 0)
//     }
// })

// AnimationJS.playerRenderer(event => {
//     event.cancel();
// })
// ClientEvents.tick(event => {
//     let player = event.getPlayer()
//     player.stopAnimation("bettercombat:two_handed_slash_horizontal_right")
//     player.stopAnimation("bettercombat:two_handed_slash_horizontal_left")
//     player.stopAnimation("bettercombat:scythe_slash")
//     player.stopAnimation("bettercombat:pose_two_handed_scythe")
// })

