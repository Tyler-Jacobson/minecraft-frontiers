const RED_LASER_ATTACK_DAMAGE = 23
const RED_LASER_REFLECTION_VELOCITY = 1.5
const RED_LASER_MAX_LIFETIME = 60

StartupEvents.registry('entity_type', event => {
    // frontiers:fireball_entity here references geo/entity/fireball_entity.geo.json and textures/entity/fireball_entity.png
    event.create("frontiers:kraken_red_projectile", "entityjs:geckolib_projectile")
        .onHitEntity(context => {
            // 'entity' in this context is the projectile that is spawned
            // 'result.entity' in this context is the target that is hit by the projectile
            const { entity, result } = context;
            if (entity.level === 'ClientLevel') return


            // The 'entity' (projectile) has a list of possible damage sources on it, accessed through damageSources()
            // to set the player as the source of damage, we choose .playerAttack() as the damage source,
            // which requires a reference to the player be passed to it.
            // This can be any player reference, in this case we're using entity.getOwner(), 
            // which is a value we set to be the player with this line in global.exampleFinishUsing below when spawning the projectile:
            const kraken = entity.getOwner()
            const damageSource = entity.damageSources().mobProjectile(entity, kraken)
            const world = kraken.level


            const hitEntity = result.entity
            // console.log(`hitEntity ${hitEntity}`)

            if (hitEntity.isPlayer() && hitEntity.isBlocking()) {

                hitEntity.attack(damageSource, RED_LASER_ATTACK_DAMAGE)

                let lookAngle = hitEntity.lookAngle
                const vel = lookAngle.scale(RED_LASER_REFLECTION_VELOCITY)
                entity.setMotion(vel.x(), vel.y(), vel.z())
            } else {
                hitEntity.attack(damageSource, RED_LASER_ATTACK_DAMAGE)
                entity.kill()
            }

            // we now get rid of the projectile entity

        }).onHitBlock(context => {
            // const { entity } = context
            // entity.kill()
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
            if (entity.age > RED_LASER_MAX_LIFETIME) {
                entity.kill()
            }
        }).noItem()
})