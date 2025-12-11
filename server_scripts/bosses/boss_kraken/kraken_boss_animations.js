let lastKrakenAction = false


LevelEvents.tick(event => {
    let levelEntities = event.level.entities
    let krakenEntities = levelEntities.filter(entity => {
        // console.log(`${entity.getName().getString()} ${Object.keys(entity)}`)
        return entity.type === 'frontiers:custom_kraken' // point of failture. This is causing the code to run on the spawn egg when dropped in the world, which breaks everything
    })

    if (krakenEntities.length) {
        krakenEntities.forEach(krakenEntity => {
            if (krakenEntity.age % 100 === 0) {
                console.log(`kraken age ${krakenEntity.age % 100} is ${krakenEntity.age}`)
                let krakenIdleActions = ['k_idle']
                let krakenTrueActions = ['k_attack']
                let passKrakenActions;
                if (lastKrakenAction === 'k_idle') {
                    lastKrakenAction = 'k_attack'
                    passKrakenActions = krakenTrueActions
                } else {
                    lastKrakenAction = 'k_idle'
                    passKrakenActions = krakenIdleActions
                }

                let randomKrakenAction = getRandomKrakenAction(passKrakenActions)
                krakenEntity.stopTriggeredAnimation('krakenBossController', 'k_idle')
                krakenEntity.stopTriggeredAnimation('krakenBossController', 'k_attack')
                krakenEntity.triggerAnimation('krakenBossController', randomKrakenAction)
            } else if (((krakenEntity.age -54) % 100 === 0) && lastKrakenAction === 'k_attack') {

                let nearestPlayer = krakenEntity.level.getNearestPlayer(krakenEntity, 64)
                if (nearestPlayer) {
                    let attackStartingLocation = mobRelativeLocation(krakenEntity, 30, 0)
                    let attackAngle = angleVecFromAToB(attackStartingLocation, nearestPlayer.getEyePosition())
                    console.log(`attackAngle1 ${attackAngle}`)
                    global.spawnKrakenRedProjectile(krakenEntity, krakenEntity.level, attackStartingLocation, attackAngle)
                }

            } else if (((krakenEntity.age -65) % 100 === 0) && lastKrakenAction === 'k_attack') {
                let nearestPlayer = krakenEntity.level.getNearestPlayer(krakenEntity, 64)
                if (nearestPlayer) {
                    let attackStartingLocation = mobRelativeLocation(krakenEntity, 30, 0)
                    let attackAngle = angleVecFromAToB(attackStartingLocation, nearestPlayer.getEyePosition())
                    console.log(`attackAngle2 ${attackAngle}`)
                    global.spawnKrakenRedProjectile(krakenEntity, krakenEntity.level, attackStartingLocation, attackAngle)
                }
            } else if (((krakenEntity.age -76) % 100 === 0) && lastKrakenAction === 'k_attack') {
                let nearestPlayer = krakenEntity.level.getNearestPlayer(krakenEntity, 64)
                if (nearestPlayer) {
                    let attackStartingLocation = mobRelativeLocation(krakenEntity, 30, 0)
                    let attackAngle = angleVecFromAToB(attackStartingLocation, nearestPlayer.getEyePosition())
                    console.log(`attackAngle3 ${attackAngle}`)
                    global.spawnKrakenRedProjectile(krakenEntity, krakenEntity.level, attackStartingLocation, attackAngle)
                }
            }


        })
    }
})


const getRandomKrakenAction = (actionsArray) => {

    let min = 0;
    let max = actionsArray.length - 1;
    let randomActionIndex = Math.floor(Math.random() * (max - min + 1)) + min;
    const newActionSelection = actionsArray[randomActionIndex]
    return newActionSelection
}