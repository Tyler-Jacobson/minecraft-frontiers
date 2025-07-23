
StartupEvents.registry('entity_type', event => {
    // frontiers:fireball_entity here references geo/entity/fireball_entity.geo.json and textures/entity/fireball_entity.png
    event.create("frontiers:fireball_entity", "entityjs:geckolib_projectile").onHitEntity(context => {
        // 'entity' in this context is the projectile that is spawned
        // 'result.entity' in this context is the target that is hit by the projectile
        const { entity, result } = context;

        // The 'entity' (projectile) has a list of possible damage sources on it, accessed through damageSources()
        // to set the player as the source of damage, we choose .playerAttack() as the damage source,
        // which requires a reference to the player be passed to it.
        // This can be any player reference, in this case we're using entity.getOwner(), 
        // which is a value we set to be the player with this line in global.exampleFinishUsing below when spawning the projectile:
        const player = entity.getOwner()
        const damageSource = entity.damageSources().playerAttack(player)
        const world = player.level

        const randomFireballCollisionSound = getRandomSound(fireballCollisionSounds, threeMostRecentFireCollisionSoundSelections)

        world.playSound(entity, entity.block.pos, randomFireballCollisionSound, "players", 3, 1)

        const collisionX = result.entity.x
        const collisionY = result.entity.y
        const collisionZ = result.entity.z

        world.spawnParticles("explosiveenhancement:fireball", false, collisionX, collisionY + 1, collisionZ, 1, 1, 1, 7, 1) // some of the particles from explosive enhancements require speed of 1 in order to display
        world.spawnParticles("explosiveenhancement:smoke", false, collisionX, collisionY + 1, collisionZ, 1, 1, 1, 10, 0.1) // some of the particles from explosive enhancements require speed of 1 in order to display
        world.spawnParticles("explosiveenhancement:blastwave", false, collisionX, collisionY + 1, collisionZ, 1, 1, 1, 3, 1) // some of the particles from explosive enhancements require speed of 1 in order to display

        // we now get rid of the projectile entity
        entity.kill()

        const RADIUS = 3

        const hitEntity = result.entity

        const { xsize, ysize, zsize } = hitEntity.boundingBox

        const nearbyEntities = hitEntity.level.getEntitiesWithin(hitEntity.boundingBox.deflate(xsize, ysize, zsize).inflate(RADIUS)).filter(entity => entity.living)

        nearbyEntities.forEach((nearbyEntity) => {
            nearbyEntity.setRemainingFireTicks(100)
            nearbyEntity.attack(damageSource, FIRESTAFF_BASE_DAMAGE)
        })
    }).onHitBlock(context => {
        const { entity } = context

        const player = entity.getOwner()
        const damageSource = entity.damageSources().playerAttack(player)
        const world = player.level

        const randomFireballBlockCollisionSound = getRandomSound(fireballCollisionSounds, threeMostRecentFireCollisionSoundSelections)

        world.playSound(entity, entity.block.pos, randomFireballBlockCollisionSound, "players", 3, 1)

        const collisionX = entity.x
        const collisionY = entity.y
        const collisionZ = entity.z

        world.spawnParticles("explosiveenhancement:fireball", false, collisionX, collisionY + 1, collisionZ, 1, 1, 1, 7, 1) // some of the particles from explosive enhancements require speed of 1 in order to display
        world.spawnParticles("explosiveenhancement:smoke", false, collisionX, collisionY + 1, collisionZ, 1, 1, 1, 10, 0.1) // some of the particles from explosive enhancements require speed of 1 in order to display
        world.spawnParticles("explosiveenhancement:blastwave", false, collisionX, collisionY + 1, collisionZ, 1, 1, 1, 3, 1) // some of the particles from explosive enhancements require speed of 1 in order to display

        const RADIUS = 3

        const hitEntity = entity

        const { xsize, ysize, zsize } = hitEntity.boundingBox

        const nearbyEntities = hitEntity.level.getEntitiesWithin(hitEntity.boundingBox.deflate(xsize, ysize, zsize).inflate(RADIUS)).filter(entity => entity.living)

        nearbyEntities.forEach((nearbyEntity) => {
            nearbyEntity.setRemainingFireTicks(100)
            nearbyEntity.attack(damageSource, FIRESTAFF_BASE_DAMAGE)

        })

        entity.kill()
    }).tick(entity => {
        const world = entity.level

        const collisionX = entity.x
        const collisionY = entity.y
        const collisionZ = entity.z

        if (entity.age === 3) {
            world.playSound(entity, entity.block.pos, 'frontiers:fire_staff_fireball_projectile_whoosh', "players", 1, 1)
        }

        const smokeParticleYOffset = 0.3
        const smokeParticleCountPerTick = 1
        const smokeParticleSpeedPerTick = 0

        const lavaParticleCountPerTick = 1
        const lavaParticleSpeedPerTick = 20

        world.spawnParticles("minecraft:smoke", false, collisionX, collisionY + smokeParticleYOffset, collisionZ, 0, 0, 0, smokeParticleCountPerTick, smokeParticleSpeedPerTick)
        world.spawnParticles("minecraft:lava", false, collisionX, collisionY, collisionZ, 0, 0, 0, lavaParticleCountPerTick, lavaParticleSpeedPerTick)
    })
})

const spawnFireball = (player, level, eyePosition, lookAngle) => {
    const projectile = level.createEntity("frontiers:fireball_entity");
    // it's crucial to set the projectile entity's owner here, since we're later going to reference this in order to get the damage source
    projectile.setOwner(player)
    const vel = lookAngle.scale(1.5)
    projectile.setMotion(vel.x(), vel.y() + 0.1, vel.z())
    projectile.setPosition(eyePosition.x(), eyePosition.y() - 0.5, eyePosition.z())
    projectile.setNoGravity(false)
    projectile.spawn()
}