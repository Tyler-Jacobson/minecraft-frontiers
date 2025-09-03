ItemEvents.firstLeftClicked("frontiers:custom_scythe", event => {
    console.info('first left clicked')
})

NetworkEvents.dataReceived('better_combat_scythe_attack_started', (event) => { // this runs on server side once when left clicking with the scythe
    // this is all I needed. This code will run on scythe left click
    let player = event.entity
    let level = event.level
    const { lookAngle, eyePosition } = player
    console.info(`event data received ${event.data}`)
    console.info(`event entity ${player}`)
    
    spawnCrescent(player, level, eyePosition, lookAngle)
});

const spawnCrescent = (player, level, eyePosition, lookAngle) => {
    const projectile = level.createEntity("frontiers:crescent");
    // it's crucial to set the projectile entity's owner here, since we're later going to reference this in order to get the damage source
    projectile.setOwner(player)
    const vel = lookAngle.scale(1.5)
    projectile.setMotion(vel.x(), vel.y(), vel.z())
    projectile.setPosition(eyePosition.x(), eyePosition.y() - 0.5, eyePosition.z())
    projectile.setNoGravity(true)
    projectile.spawn()
}