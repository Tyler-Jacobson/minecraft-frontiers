let YELLOW_LASER_MOVE_SPEED = 0.3



StartupEvents.registry('entity_type', event => {
    // frontiers:fireball_entity here references geo/entity/fireball_entity.geo.json and textures/entity/fireball_entity.png
    event.create("frontiers:kraken_red_projectile", "entityjs:geckolib_projectile").onHitEntity(context => {
        // // 'entity' in this context is the projectile that is spawned
        // // 'result.entity' in this context is the target that is hit by the projectile
        const { entity, result } = context;

        // // The 'entity' (projectile) has a list of possible damage sources on it, accessed through damageSources()
        // // to set the player as the source of damage, we choose .playerAttack() as the damage source,
        // // which requires a reference to the player be passed to it.
        // // This can be any player reference, in this case we're using entity.getOwner(), 
        // // which is a value we set to be the player with this line in global.exampleFinishUsing below when spawning the projectile:
        const kraken = entity.getOwner()
        const damageSource = entity.damageSources().indirectMagic(entity, kraken)
        const world = kraken.level

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
        console.log(`hitEntity ${hitEntity}`)
        hitEntity.attack(damageSource, 15)
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
    }).noItem()
})

StartupEvents.registry('entity_type', event => {
    // frontiers:fireball_entity here references geo/entity/fireball_entity.geo.json and textures/entity/fireball_entity.png
    const builder = event.create("frontiers:kraken_yellow_laser", "entityjs:geckolib_projectile")
        .newGlowingGeoLayer(builder => {
            builder.textureResource(entity => {
                // return some glowing texture overlay
                return "frontiers:textures/entity/kraken_yellow_laser.png"
            })
        })
        .onHitEntity(context => {
            // // 'entity' in this context is the projectile that is spawned
            // // 'result.entity' in this context is the target that is hit by the projectile
            const { entity, result } = context;

            // // The 'entity' (projectile) has a list of possible damage sources on it, accessed through damageSources()
            // // to set the player as the source of damage, we choose .playerAttack() as the damage source,
            // // which requires a reference to the player be passed to it.
            // // This can be any player reference, in this case we're using entity.getOwner(), 
            // // which is a value we set to be the player with this line in global.exampleFinishUsing below when spawning the projectile:
            const kraken = entity.getOwner()
            const damageSource = entity.damageSources().indirectMagic(entity, kraken) // this is where we change the damage type
            const world = kraken.level

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
            console.log(`hitEntity ${hitEntity}`)
            hitEntity.attack(damageSource, 15)
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
            const target = world.getNearestPlayer(entity, 64)

            // let destinationAngle = angleVecFromAToB(entity.getEyePosition(), target)
            // let MOVE_SPEED = 0.1
            // const moveTo = new Vec3d((target.x - entity.getX()) * MOVE_SPEED, (target.y - entity.getY()) * MOVE_SPEED, (target.z - entity.getZ()) * MOVE_SPEED)
            // entity.setDeltaMovement(moveTo)

            let destinationAngle = global.angleVecFromAToB(entity.getEyePosition(), target.getEyePosition())
            const vel = destinationAngle.scale(YELLOW_LASER_MOVE_SPEED)
            entity.setMotion(vel.x(), vel.y(), vel.z())

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
        }).noItem()
})


StartupEvents.registry('entity_type', event => {
    // frontiers:fireball_entity here references geo/entity/fireball_entity.geo.json and textures/entity/fireball_entity.png
    event.create("frontiers:kraken_blue_laser", "entityjs:geckolib_projectile")
        .newGlowingGeoLayer(builder => {
            builder.textureResource(entity => {
                // return some glowing texture overlay
                return "frontiers:textures/entity/kraken_blue_laser.png"
            })
        })
        .onHitEntity(context => {
            // // 'entity' in this context is the projectile that is spawned
            // // 'result.entity' in this context is the target that is hit by the projectile
            const { entity, result } = context;

            // // The 'entity' (projectile) has a list of possible damage sources on it, accessed through damageSources()
            // // to set the player as the source of damage, we choose .playerAttack() as the damage source,
            // // which requires a reference to the player be passed to it.
            // // This can be any player reference, in this case we're using entity.getOwner(), 
            // // which is a value we set to be the player with this line in global.exampleFinishUsing below when spawning the projectile:
            const kraken = entity.getOwner()
            const damageSource = entity.damageSources().indirectMagic(entity, kraken)
            const world = kraken.level

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
            console.log(`hitEntity ${hitEntity}`)
            hitEntity.attack(damageSource, 15)
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

            const collisionX = entity.x
            const collisionY = entity.y
            const collisionZ = entity.z
            function placeObsidianAt(x, y, z) {
                let roundedX = Math.round(x)
                let roundedY = Math.round(y)
                let roundedZ = Math.round(z)
                console.log(`setblock ${x} ${y} ${z} frontiers:tick_logger_block`)
                Utils.server.runCommandSilent(`setblock ${roundedX} ${roundedY} ${roundedZ} frontiers:tick_logger_block`)
            }
            // function placeObsidianAt(x, y, z) {
            //     console.log(`setblock ${x} ${y} ${z} minecraft:obsidian destroy`)
            //     Utils.server.runCommandSilent(`setblock ${x} ${y} ${z} minecraft:obsidian destroy`)
            // }
            console.log(`hit block at ${collisionX} ${collisionY} ${collisionZ}`)
            try {
                placeObsidianAt(collisionX, collisionY, collisionZ)

            } catch (err) {
                console.log(`failed to place obsidian ${err}`)
            }


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
        }).noItem()
})