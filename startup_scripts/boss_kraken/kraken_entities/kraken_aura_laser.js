const AURA_LASER_MOVE_SPEED = 0
const AURA_LASER_DAMAGE = 16
const AURA_LASER_TARGETING_RADIUS = 64
const AURA_LASER_MAX_LIFETIME = 300

StartupEvents.registry('entity_type', event => {
    // frontiers:fireball_entity here references geo/entity/fireball_entity.geo.json and textures/entity/fireball_entity.png
    const builder = event.create("frontiers:kraken_aura_laser", "entityjs:geckolib_projectile")
        .newGlowingGeoLayer(builder => {
            builder.textureResource(entity => {
                // return some glowing texture overlay
                return "frontiers:textures/entity/kraken_aura_laser.png"
            })
        })
        .isAttackable(false)
        .onHitEntity(context => {
            // 'entity' in this context is the projectile that is spawned
            // 'result.entity' in this context is the target that is hit by the projectile
            const { entity, result } = context;
            if (result.entity.type === 'frontiers:custom_kraken' || result.entity.type === 'block_factorys_bosses:soul_skeleton') return
            if (entity.level === 'ClientLevel') return



            const kraken = entity.getOwner()
            if (!kraken) {
                entity.kill()
            }
            const damageSource = entity.damageSources().mobProjectile(entity, kraken) // this is where we change the damage type
            const hitEntity = result.entity
            hitEntity.attack(damageSource, AURA_LASER_DAMAGE)

            // we now get rid of the projectile entity
            entity.kill()
        }).onHitBlock(context => {
            // const { entity } = context
            // entity.kill()
        }).tick(entity => {
            const world = entity.level
            const target = world.getNearestPlayer(entity, AURA_LASER_TARGETING_RADIUS)

            if (!target) {
                console.log(`no target found for ${entity}`)
                entity.kill()
                return
            }
            if (target.isFallFlying()) {
                let destinationWithYOffset = new Vec3d(target.getEyePosition().x(), target.getEyePosition().y(), target.getEyePosition().z())
                let destinationAngle = global.angleVecFromAToB(entity.getEyePosition(), destinationWithYOffset)
                const elytraSpeedMultiplier = Math.log(entity.age) * 0.5
                const vel = destinationAngle.scale(AURA_LASER_MOVE_SPEED + elytraSpeedMultiplier)
                entity.setMotion(vel.x(), vel.y(), vel.z())
            } else {
                let destinationWithYOffset = new Vec3d(target.getEyePosition().x(), target.getEyePosition().y() - 0.5, target.getEyePosition().z())

                let destinationAngle = global.angleVecFromAToB(entity.getEyePosition(), destinationWithYOffset)
                const vel = destinationAngle.scale(AURA_LASER_MOVE_SPEED + (Math.log(entity.age) * 0.1))
                entity.setMotion(vel.x(), vel.y(), vel.z())
            }

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
            if (entity.age > AURA_LASER_MAX_LIFETIME) {
                entity.kill()
            }
        }).noItem()
})