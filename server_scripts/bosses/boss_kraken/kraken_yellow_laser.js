const runYellow = (entity, event) => {
    console.log('running yellow')
    let actionDuration = 100
    entity.persistentData.startNextActionAge = entity.age + actionDuration
    entity.persistentData.putBoolean('lastActionWasIdle', false)
    try {
        entity.triggerAnimation('krakenBossController', 'k_yellow_laser')

    } catch (err) {
        console.log(`could not trigger animation ${err}`)
    }
    let uuid = entity.uuid
    entity.persistentData.actionQueue = []
    // target = getTarget() // set target player into storage as current look / move around target

    event.server.scheduleInTicks(50, () => {
        runYellowAttack(uuid, event)
    })
}

const runYellowAttack = (uuid, event) => {
    let entity = event.level.getEntity(uuid)
    if (entity && entity.isAlive()) {
        let attackStartingLocation = mobRelativeLocation(entity, 10, 45, 20)
        let nearestPlayer = entity.level.getNearestPlayer(entity, 128) // temporary. Replace with 'target' or 'each'
        let attackAngle = global.angleVecFromAToB(attackStartingLocation, nearestPlayer.getEyePosition())
        spawnKrakenYellowProjectile(entity, entity.level, attackStartingLocation, attackAngle)
    }

}

const spawnKrakenYellowProjectile = (mob, level, attackStartingLocation, lookAngle) => {
    // const { level } = mob
    const projectile = level.createEntity("frontiers:kraken_yellow_laser");
    // it's crucial to set the projectile entity's owner here, since we're later going to reference this in order to get the damage source
    projectile.setOwner(mob)
    const vel = lookAngle.scale(0.5)
    projectile.setMotion(vel.x(), vel.y(), vel.z())
    projectile.setPosition(attackStartingLocation.x(), attackStartingLocation.y(), attackStartingLocation.z())
    projectile.setNoGravity(true)
    projectile.spawn()
}