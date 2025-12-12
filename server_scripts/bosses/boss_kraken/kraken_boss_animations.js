let lastKrakenAction = false


LevelEvents.tick(event => {
    let levelEntities = event.level.entities
    let krakenEntities = levelEntities.filter(entity => {
        return entity.type === 'frontiers:custom_kraken'
    })

    if (krakenEntities.length) {
        krakenEntities.forEach(krakenEntity => {
            if (krakenEntity.age >= krakenEntity.persistentData.startNextActionAge) {
                global.startNewAction(krakenEntity, event)
            }
        })
    }
})

const stopAllAnimations = (entity) => {
    entity.stopTriggeredAnimation('krakenBossController', 'k_idle')
    entity.stopTriggeredAnimation('krakenBossController', 'k_attack')
}

const runIdle = (entity) => {
    let actionDuration = 100 // how long will the action take (in ticks)
    entity.persistentData.startNextActionAge = entity.age + actionDuration // set persistent data to run new action after this one finishes
    entity.persistentData.putBoolean('lastActionWasIdle', true) // set persistent data for when we run the next action, to know we just ran idle
    entity.triggerAnimation('krakenBossController', 'k_idle') // play animations
    entity.persistentData.actionQueue = [] // clear the action queue so we don't get stuck in an infinite loop
    // movement function here
}

const spawnKrakenRedProjectile = (mob, level, attackStartingLocation, lookAngle) => {
    // const { level } = mob
    const projectile = level.createEntity("frontiers:kraken_red_projectile");
    // it's crucial to set the projectile entity's owner here, since we're later going to reference this in order to get the damage source
    projectile.setOwner(mob)
    const vel = lookAngle.scale(3)
    projectile.setMotion(vel.x(), vel.y(), vel.z())
    projectile.setPosition(attackStartingLocation.x(), attackStartingLocation.y(), attackStartingLocation.z())
    projectile.setNoGravity(true)
    projectile.spawn()
}


const runRed = (entity, event) => {
    let actionDuration = 100
    entity.persistentData.startNextActionAge = entity.age + actionDuration
    entity.persistentData.putBoolean('lastActionWasIdle', false)
    entity.triggerAnimation('krakenBossController', 'k_attack')
    let uuid = entity.uuid
    entity.persistentData.actionQueue = []
    // target = getTarget() // set target player into storage as current look / move around target

    event.server.scheduleInTicks(50, () => {
        runRedAttack(uuid, event)
    })
    event.server.scheduleInTicks(60, () => {
        runRedAttack(uuid, event)
    })
    event.server.scheduleInTicks(70, () => {
        runRedAttack(uuid, event)
    })
}

const runRedAttack = (uuid, event) => {
    let entity = event.level.getEntity(uuid)
    let attackStartingLocation = mobRelativeLocation(entity, 30, 0)
    let nearestPlayer = entity.level.getNearestPlayer(entity, 128) // temporary. Replace with 'target' or 'each'
    let attackAngle = angleVecFromAToB(attackStartingLocation, nearestPlayer.getEyePosition())
    spawnKrakenRedProjectile(entity, entity.level, attackStartingLocation, attackAngle)
}

const randomActionSelector = (entity) => {
    if (!entity.persistentData.getBoolean('lastActionWasIdle')) {
        return 'idle'
    }
    // randomizer here when more attacks are added
    return 'red'
}

global.startNewAction = (entity, event) => {
    let actionQueue;
    if (!entity.persistentData.actionQueue.length) {
        actionQueue = randomActionSelector(entity)
    } else {
        actionQueue = entity.persistentData.actionQueue[0]
    }
    stopAllAnimations(entity)

    switch (actionQueue) {
        case 'idle':
            runIdle(entity)
            break;
        case 'red':
            runRed(entity, event)
            break;
        case 'yellow':
            runYellow(entity)
            break;
        case 'blue':
            runBlue(entity)
            break;
        case 'white':
            runWhite(entity) // giga laser
            break;
        default:
            console.error('ran default in global.startNewAction')
            runIdle(entity)
    }
}

