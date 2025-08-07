const shearChickenBaseCooldown = 6000 // in ticks

LevelEvents.tick(event => {
    let levelEntities = event.level.entities
    let chickenEntities = levelEntities.filter(entity => {
        return entity.getName().getString() === 'Chicken'
    })

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

    if (entity.getName().getString() === 'Chicken') {
        if (!entity.persistentData.remainingShearCooldown) {
            const damageSource = entity.damageSources().playerAttack(player)
            
            entity.attack(damageSource, 0)
            entity.persistentData.remainingShearCooldown = shearChickenBaseCooldown
            event.target.block.popItemFromFace(Item.of("minecraft:feather"), "up")

            player.swing()
            global.setPlayerSpecificData(player, 'shouldPlayShearChickenSound', true)

        } else {
            player.swing()
            console.info(`shear chicken on cooldown`)
        }
    }
}))