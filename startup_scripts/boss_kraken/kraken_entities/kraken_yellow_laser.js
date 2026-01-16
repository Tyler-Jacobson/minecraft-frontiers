const YELLOW_LASER_MOVE_SPEED = 0.3
const YELLOW_LASER_ATTACK_DAMAGE = 15
const YELLOW_LASER_ELYTRA_ATTACK_DAMAGE = 30
const YELLOW_LASER_TARGETING_RADIUS = 128
const YELLOW_LASER_MAX_LIFETIME = 300

StartupEvents.registry('entity_type', event => {
    // frontiers:fireball_entity here references geo/entity/fireball_entity.geo.json and textures/entity/fireball_entity.png
    const builder = event.create("frontiers:kraken_yellow_laser", "entityjs:geckolib_projectile")
        .newGlowingGeoLayer(builder => {
            builder.textureResource(entity => {
                // return some glowing texture overlay
                return "frontiers:textures/entity/kraken_yellow_laser.png"
            })
        })
        .isAttackable(true)
        .onHitEntity(context => {
            // // 'entity' in this context is the projectile that is spawned
            // // 'result.entity' in this context is the target that is hit by the projectile
            const { entity, result } = context;
            if (result.entity.type === 'frontiers:void_kraken' || result.entity.type === 'block_factorys_bosses:soul_skeleton') return
            if (entity.level === 'ClientLevel') return



            // // The 'entity' (projectile) has a list of possible damage sources on it, accessed through damageSources()
            // // to set the player as the source of damage, we choose .playerAttack() as the damage source,
            // // which requires a reference to the player be passed to it.
            // // This can be any player reference, in this case we're using entity.getOwner(), 
            // // which is a value we set to be the player with this line in global.exampleFinishUsing below when spawning the projectile:
            const kraken = entity.getOwner()
            if (!kraken) {
                entity.kill()
            }
            const damageSource = entity.damageSources().indirectMagic(entity, kraken) // this is where we change the damage type

            // const randomFireballCollisionSound = getRandomSound(fireballCollisionSounds, threeMostRecentFireCollisionSoundSelections)

            // world.playSound(entity, entity.block.pos, randomFireballCollisionSound, "players", 3, 1)

            // const collisionX = result.entity.x
            // const collisionY = result.entity.y
            // const collisionZ = result.entity.z

            // world.spawnParticles("explosiveenhancement:fireball", false, collisionX, collisionY + 1, collisionZ, 1, 1, 1, 7, 1) // some of the particles from explosive enhancements require speed of 1 in order to display
            // world.spawnParticles("explosiveenhancement:smoke", false, collisionX, collisionY + 1, collisionZ, 1, 1, 1, 10, 0.1) // some of the particles from explosive enhancements require speed of 1 in order to display
            // world.spawnParticles("explosiveenhancement:blastwave", false, collisionX, collisionY + 1, collisionZ, 1, 1, 1, 3, 1) // some of the particles from explosive enhancements require speed of 1 in order to display



            // const RADIUS = 3

            const hitEntity = result.entity
            // console.log(`hitEntity ${hitEntity}`)
            if (hitEntity.isFallFlying()) {
                hitEntity.attack(damageSource, YELLOW_LASER_ELYTRA_ATTACK_DAMAGE)
            } else {
                hitEntity.attack(damageSource, YELLOW_LASER_ATTACK_DAMAGE)
            }
            // const { xsize, ysize, zsize } = hitEntity.boundingBox

            // let nearbyEntities = hitEntity.level.getEntitiesWithin(hitEntity.boundingBox.deflate(xsize, ysize, zsize).inflate(RADIUS)).filter(entity => entity.living)
            // let itemStack = global.getPlayerSpecificData(player, 'mostRecentFireStaffAttackItemstack')
            // let powerEnchantBonusDamage = getFireStaffPowerEnchantmentBonusDamage(itemStack)
            // console.info(`hasKindnessEnchant ${hasKindnessEnchant(itemStack)}`)
            // if (hasKindnessEnchant(itemStack)) {
            //     nearbyEntities = nearbyEntities.filter(entity => !entity.isPlayer())
            // }

            // nearbyEntities.forEach((nearbyEntity) => {
            //     nearbyEntity.setRemainingFireTicks(100)
            //     nearbyEntity.attack(damageSource, FIRESTAFF_BASE_DAMAGE + powerEnchantBonusDamage)
            // })

            // // we now get rid of the projectile entity
            entity.kill()
        }).onHitBlock(context => {
            const { entity } = context

            // const player = entity.getOwner()
            // const damageSource = entity.damageSources().playerAttack(player)
            // const world = player.level

            // const randomFireballBlockCollisionSound = getRandomSound(fireballCollisionSounds, threeMostRecentFireCollisionSoundSelections)

            // world.playSound(entity, entity.block.pos, randomFireballBlockCollisionSound, "players", 3, 1)

            // const collisionX = entity.x
            // const collisionY = entity.y
            // const collisionZ = entity.z

            // world.spawnParticles("explosiveenhancement:fireball", false, collisionX, collisionY + 1, collisionZ, 1, 1, 1, 7, 1) // some of the particles from explosive enhancements require speed of 1 in order to display
            // world.spawnParticles("explosiveenhancement:smoke", false, collisionX, collisionY + 1, collisionZ, 1, 1, 1, 10, 0.1) // some of the particles from explosive enhancements require speed of 1 in order to display
            // world.spawnParticles("explosiveenhancement:blastwave", false, collisionX, collisionY + 1, collisionZ, 1, 1, 1, 3, 1) // some of the particles from explosive enhancements require speed of 1 in order to display

            // const RADIUS = 3

            // const hitEntity = entity

            // const { xsize, ysize, zsize } = hitEntity.boundingBox

            // let nearbyEntities = hitEntity.level.getEntitiesWithin(hitEntity.boundingBox.deflate(xsize, ysize, zsize).inflate(RADIUS)).filter(entity => entity.living)


            // let itemStack = global.getPlayerSpecificData(player, 'mostRecentFireStaffAttackItemstack')
            // let powerEnchantBonusDamage = getFireStaffPowerEnchantmentBonusDamage(itemStack)
            // if (hasKindnessEnchant(itemStack)) {
            //     nearbyEntities = nearbyEntities.filter(entity => !entity.isPlayer())
            // }

            // nearbyEntities.forEach((nearbyEntity) => {
            //     nearbyEntity.setRemainingFireTicks(100)
            //     nearbyEntity.attack(damageSource, FIRESTAFF_BASE_DAMAGE + powerEnchantBonusDamage)

            // })

            entity.kill()
        }).tick(entity => {
            const world = entity.level
            const target = world.getNearestPlayer(entity, YELLOW_LASER_TARGETING_RADIUS)

            // let destinationAngle = angleVecFromAToB(entity.getEyePosition(), target)
            // let MOVE_SPEED = 0.1
            // const moveTo = new Vec3d((target.x - entity.getX()) * MOVE_SPEED, (target.y - entity.getY()) * MOVE_SPEED, (target.z - entity.getZ()) * MOVE_SPEED)
            // entity.setDeltaMovement(moveTo)
            if (!target) {
                console.log(`no target found for ${entity}`)
                entity.kill()
                return
            }

            if (target.isFallFlying()) {
                let destinationWithYOffset = new Vec3d(target.getEyePosition().x(), target.getEyePosition().y(), target.getEyePosition().z())
                let destinationAngle = global.angleVecFromAToB(entity.getEyePosition(), destinationWithYOffset)
                const elytraSpeedMultiplier = Math.log(entity.age) * 0.5
                const vel = destinationAngle.scale(YELLOW_LASER_MOVE_SPEED + elytraSpeedMultiplier)
                entity.setMotion(vel.x(), vel.y(), vel.z())
            } else {
                let destinationWithYOffset = new Vec3d(target.getEyePosition().x(), target.getEyePosition().y() - 0.5, target.getEyePosition().z())
                let destinationAngle = global.angleVecFromAToB(entity.getEyePosition(), destinationWithYOffset)
                const vel = destinationAngle.scale(YELLOW_LASER_MOVE_SPEED)
                entity.setMotion(vel.x(), vel.y(), vel.z())
            }

            const collisionX = entity.x
            const collisionY = entity.y
            const collisionZ = entity.z

            const playSoundInterval = 20
            if (entity.age % playSoundInterval === 0) {
                world.playSound(entity, entity.block.pos, 'call_of_yucutan:light_beam', "players", 0.5, 0)
            }

            const particleCountPerTick = 1
            const particleSpeedPerTick = 0
            const tickInterval = 3

            if (entity.age % tickInterval === 0) {
                world.spawnParticles("galosphere:lumiere_rain", false, collisionX, collisionY, collisionZ, 0.3, 0.3, 0.3, particleCountPerTick, particleSpeedPerTick)
            }

            if (entity.age > YELLOW_LASER_MAX_LIFETIME) {
                entity.kill()
            }
        }).noItem()
})