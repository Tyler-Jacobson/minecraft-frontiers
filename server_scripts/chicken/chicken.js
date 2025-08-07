// ItemEvents.rightClicked(event => {
//     let player = event.player
//     let item = player.mainHandItem
//     if (!item || item.isEmpty()) return
//     if (item.id === 'minecraft:shears') {

//     }
// })

// let chickenShearCooldownTicks = global.chickenShearCooldownTicks

const shearChickenBaseCooldown = 100 // in ticks

// ClientEvents.tick(event => {

// })

global.globalPlayerDataMap = new Map();


LevelEvents.tick(event => {
    let levelEntities = event.level.entities
    let chickenEntities = levelEntities.filter(entity => {
        return entity.getName().getString() === 'Chicken'
    })
    // let player = event.getPlayer()


    if (chickenEntities.length) {
        chickenEntities.forEach(chickenEntity => {
            if (chickenEntity.persistentData.remainingShearCooldown > 0) {
                chickenEntity.persistentData.remainingShearCooldown--
            }
        })
    }
})

ItemEvents.entityInteracted('minecraft:shears', (event => {
    let entity = event.getTarget()
    let player = event.getPlayer()
    // console.info(global.globalPlayerDataMap.get(player.getStringUuid()))
    console.info(`shouldPlayShearChickenSound ${global.getPlayerSpecificData(player, 'shouldPlayShearChickenSound')}`)


    if (entity.getName().getString() === 'Chicken') {
        if (!entity.persistentData.remainingShearCooldown) {
            console.info(`sheared chicken`)
            entity.persistentData.remainingShearCooldown = 100
            event.target.block.popItemFromFace(Item.of("minecraft:feather"), "up")
            player.swing()
            const damageSource = entity.damageSources().playerAttack(player)
            entity.attack(damageSource, 0)
            global.setPlayerSpecificData(player, 'shouldPlayShearChickenSound', true)

        } else {
            player.swing()
            console.info(`shear chicken on cooldown`)
        }
    }
}))

// ItemEvents.entityInteracted('minecraft:iron_ingot', (event => {
//     let entity = event.getTarget()
//     let level = event.getTarget().getLevel()
//     let player = event.getPlayer()
//     console.info(`player ${player}`)
//     // console.info(`used shears on ${event.getTarget().getId()}`)
//     if (entity.getName().getString() === 'Chicken') {


//         console.info(`entity.ticksExisted ${entity.age} ${entity.persistentData.lastShearTime} ${chickenShearCooldownTicks}`)
//     }
// }))