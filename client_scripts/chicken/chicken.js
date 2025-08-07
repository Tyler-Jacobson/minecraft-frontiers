// let chickenShearCooldownTicks = global.chickenShearCooldownTicks

// ItemEvents.entityInteracted('minecraft:shears', (event => {
//     let entity = event.getTarget()
//     let level = event.getTarget().getLevel()
//     let player = event.getPlayer()
//     console.info(`player ${player}`)
//     // console.info(`used shears on ${event.getTarget().getId()}`)
//     console.info(`entity.getNbt() ${entity.getNbt()}`)
//     // entity.setNbt('test', true)

//     if (entity.getName().getString() === 'Chicken') {
//         console.info(`entity.ticksExisted ${entity.age} ${entity.persistentData.nextAlloweShearTickClient} ${chickenShearCooldownTicks}`)

//         if (!entity.persistentData.nextAlloweShearTickClient) {
//             console.info(`played first shear chicken sound ${entity.persistentData.nextAlloweShearTickClient}`)

//             level.playSound(player, player.block.pos, 'entity.sheep.shear', "players", 1, 1)
//             entity.persistentData.nextAlloweShearTickClient = entity.age + chickenShearCooldownTicks


//         } else if (entity.age > entity.persistentData.nextAlloweShearTickClient) {
//             console.info(`played shear chicken sound ${entity.persistentData.nextAlloweShearTickClient}`)
//             level.playSound(player, player.block.pos, 'entity.sheep.shear', "players", 1, 1)
//             entity.persistentData.nextAlloweShearTickClient = entity.age + chickenShearCooldownTicks
//         } else {
//             console.info(`failed to play shear chicken sound ${entity.persistentData.nextAlloweShearTickClient}`)
//         }
//     }


// }))

ClientEvents.tick(event => {
    let player = event.getPlayer()
    let level = event.getPlayer().getLevel()
    console.info(global.getPlayerSpecificData(player, 'shouldPlayShearChickenSound'))

    if (global.getPlayerSpecificData(player, 'shouldPlayShearChickenSound')) {
        console.info(`should play`)
        level.playSound(player, player.block.pos, 'entity.sheep.shear', "players", 1, 1)
        global.setPlayerSpecificData(player, 'shouldPlayShearChickenSound', false)

    }
})

// LevelEvents.tick(event => {
//     // console.info(`level event tick`)
//     let levelEntities = event.level.entities
//     let chickenEntities = levelEntities.filter(entity => {
//         return entity.getName().getString() === 'Chicken'
//     })
//     if (chickenEntities.length) {
//         chickenEntities.forEach(chickenEntity => {
//             if (chickenEntity.persistentData.remainingShearCooldown > 0) {
//                 console.info(`remaining shear cooldown ${chickenEntity.persistentData.remainingShearCooldown}`)
//                 chickenEntity.persistentData.remainingShearCooldown--
//             }
//         })
//     }
// })

// ItemEvents.entityInteracted('minecraft:shears', (event => {
//     let entity = event.getTarget()
//     let player = event.getPlayer()
//     let level = event.getTarget().getLevel()
//     if (entity.getName().getString() === 'Chicken') {
//         if (!entity.persistentData.remainingShearCooldown) {
//             console.info(`sheared chicken`)
//             entity.persistentData.remainingShearCooldown = 100
//             level.playSound(player, player.block.pos, 'entity.sheep.shear', "players", 1, 1)

//             // event.target.block.popItemFromFace(Item.of("minecraft:feather"), "up")
//             // player.swing()
//             // const damageSource = entity.damageSources().playerAttack(player)
//             // entity.attack(damageSource, 0)
//         } else {
//             player.swing()
//             console.info(`shear chicken on cooldown`)
//         }
//     }
// }))