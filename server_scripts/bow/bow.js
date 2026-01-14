// // priority: 0

// // const waitCallback = (event, time, callback) => {
// //     const eventCopy = event.copy()
// //     event.wait(time)
// //     return callback()
// // }
// EntityEvents.hurt(event => {

//     // // Only proceed if a player was the source of damage
//     // console.info(`damage source: ${event.source}`)
//     // if (event.source.player) {
//     //     let playerSource = event.source.player;

//     //     playerSource.tell(`event.damage is now: ${event.damage}`);
//     //     // event.wait(20)

//     //     // playerSource.tell(`event.damage is now: ${event.damage}`);

//     //     // waitCallback(event, 20, console.info(`wait callback`))
//     // }
// });

// EntityEvents.spawned((event => {
//     if (event.getEntity().getName().getString() === 'Arrow') {
//         // console.info(`event.getPlayer() ${event.getPlayer()} ${event.getEntity().getName().getString()}`)
//         let player = event.entity.owner
//         // console.info(`event.getOwner() ${player}`)
//     }
//     // console.info(`event.getPlayer() ${event.getPlayer()} ${event.getEntity().getId()}`)
//     // if (event.getPlayer()) {
//     //     event.getPlayer().tell(`spawned entity ${event.getPlayer()}`);
//     // }
//     // entity.minecraft.arrow
//     // if (event?.source?.player) {
//     //     let playerSource = event.source.player;
//     //     playerSource.tell(`spawned entity`);
//     // }
// }))

