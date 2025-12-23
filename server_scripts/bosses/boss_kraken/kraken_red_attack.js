const runRed = (entity, event) => {
    let actionDuration = 100
    entity.persistentData.startNextActionAge = entity.age + actionDuration
    entity.persistentData.putBoolean('lastActionWasIdle', false)
    entity.triggerAnimation('krakenBossController', 'k_red_laser')
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
    if (entity && entity.isAlive()) {
        let attackStartingLocation = mobRelativeLocation(entity, 30, 0, 20)
        let nearestPlayer = entity.level.getNearestPlayer(entity, 128) // temporary. Replace with 'target' or 'each'
        let attackAngle = global.angleVecFromAToB(attackStartingLocation, nearestPlayer.getEyePosition())
        spawnKrakenRedProjectile(entity, entity.level, attackStartingLocation, attackAngle)
    }

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