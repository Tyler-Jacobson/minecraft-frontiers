const runRed = (entity, event) => {
    console.log('running red')
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
        let attackStartingLocation = mobRelativeLocation(entity, 28, 0, 5)
        let nearestPlayer = entity.level.getNearestPlayer(entity, 128) // temporary. Replace with 'target' or 'each'
        let nearestPlayerCenterMass = new Vec3d(nearestPlayer.getEyePosition().x(), nearestPlayer.getEyePosition().y() -1, nearestPlayer.getEyePosition().z())
        let attackAngle = global.angleVecFromAToB(attackStartingLocation, nearestPlayerCenterMass)
        spawnKrakenRedProjectile(entity, entity.level, attackStartingLocation, attackAngle)
    }

}

const spawnKrakenRedProjectile = (mob, level, attackStartingLocation, lookAngle) => {
    // const { level } = mob
    const projectile = level.createEntity("frontiers:kraken_red_laser");
    // it's crucial to set the projectile entity's owner here, since we're later going to reference this in order to get the damage source
    projectile.setOwner(mob)
    const vel = lookAngle.scale(3)
    projectile.setMotion(vel.x(), vel.y(), vel.z())
    projectile.setPosition(attackStartingLocation.x(), attackStartingLocation.y(), attackStartingLocation.z())
    projectile.setNoGravity(true)
    projectile.spawn()
}