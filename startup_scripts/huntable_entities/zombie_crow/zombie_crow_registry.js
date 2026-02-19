const ZOMBIE_CROW_ID = 'frontiers:zombie_crow'
const ORBIT_RADIUS = 10
const CROW_PROJECTILE_DAMAGE = 5
const ZOMBIE_CROW_PROJECTILE_RADIUS = 2

EntityJSEvents.createAttributes(event => {
    event.create(ZOMBIE_CROW_ID, attribute => {
        attribute.add("minecraft:generic.max_health", 40)
        attribute.add("minecraft:generic.movement_speed", 1)
    })
})


EntityJSEvents.modifyEntity(event => {
    event.modify(ZOMBIE_CROW_ID, modifyBuilder => {
        modifyBuilder.defineSyncedData(entity => {
            entity.addSyncedData("string", "headUUID", "default")
            entity.addSyncedData("int", "orbitalDestinationIndex", 0)

            entity.addSyncedData("int", "ownerBlockLocationX", 0)
            entity.addSyncedData("int", "ownerBlockLocationY", 0)
            entity.addSyncedData("int", "ownerBlockLocationZ", 0)
        })
    })
})

StartupEvents.registry('entity_type', event => {
    const builder = event.create(ZOMBIE_CROW_ID, 'entityjs:tamable')
        .mobCategory('creature')
        .sized(1.5, 1.5)
        .eggItem(item => {
            item.backgroundColor(0xff0000)
            item.highlightColor(0xffbe8f)
        })
        .tick(entity => { })
        .onAddedToWorld(entity => { // onAddedToWorld never seems to run
        })
    builder.newGeoLayer(builder => {
        // builder.render(context => global.geoLayerRender(context))
        builder.textureResource(e => `frontiers:textures/entity/zombie_crow.png`)
    })
    builder.onHurt(context => {
        // Log the amount of damage received by the entity
        // global.runOnHurt(context)
    })
    builder.aiStep(entity => {
        global.runZombieCrowTick(entity)
    })
    builder.createNavigation(context => EntityJSUtils.createFlyingPathNavigation(context.entity, context.level))
    builder.dropCustomDeathLoot(context => {
        context.entity.block.popItemFromFace('butchersdelight:dead_cow', 'up')
    })
    builder.addPartEntity("one", 0.9, 0.9, builder => {
        // Adds an additional hitbox to the entity with builder support
        builder
            .isPickable(true)
            .onPartHurt(context => {
                const { entity, part, source, amount } = context
                // Custom logic for determining how the parts of the entity should relay damage
                // To the entity. For example, relay double the damage to the entity when this hitbox is hit
                entity.attack(source, amount * 2)
                console.log("source: " + source + " amount: " + amount + " part name: " + part.name)
            })
    })
})

global.runZombieCrowTick = entity => {
    if (!(entity.level === 'ClientLevel')) {
        let nearestPlayer = null
        let nearestDistance = 999999
        entity.level.players.forEach(player => {
            let distance = entity.distanceToSqr(new Vec3d(player.x, player.y, player.z))
            if (distance < nearestDistance) { nearestDistance = distance; nearestPlayer = player }
        })
        // console.log(`nearest player ${nearestPlayer}`)
        if (!nearestPlayer) return
        let pointIndex = entity.getSyncedData("orbitalDestinationIndex")

        // mob checkpoint debug:
        for (let index = 0; index < 8; index++) {
            let angle = (index % 8) * (JavaMath.PI / 4)
            let targetX = nearestPlayer.x + Math.cos(angle) * ORBIT_RADIUS
            let targetY = entity.y
            let targetZ = nearestPlayer.z + Math.sin(angle) * ORBIT_RADIUS
            // console.log(`running loop ${targetX} ${targetY} ${targetZ}`)
            if (pointIndex === index) {
                entity.level.spawnParticles("minecraft:lava", false, targetX, targetY, targetZ, 0, 0, 0, 1, 0)

            } else {
                entity.level.spawnParticles("call_of_yucutan:rain_wisp", true, targetX, targetY, targetZ, 0, 0, 0, 1, 0)
            }
        }

        // actual movement logic:
        let angle = (pointIndex % 8) * (JavaMath.PI / 4)

        let targetX = nearestPlayer.x + Math.cos(angle) * ORBIT_RADIUS
        let targetY = entity.y
        let targetZ = nearestPlayer.z + Math.sin(angle) * ORBIT_RADIUS

        // entity.getNavigation().recomputePath()
        // entity.getNavigation().moveTo(targetX, targetY, targetZ, 2)

        let entityX = entity.x
        let entityZ = entity.z

        if (entityX > targetX - 1 && entityX < targetX + 1 && entityZ > targetZ - 1 && entityZ < targetZ + 1) {
            console.log(`hit checkpoint`)
            if (pointIndex >= 7) {
                entity.setSyncedData("orbitalDestinationIndex", 0) // for some reason naming this correctly fucks it
            } else {
                entity.setSyncedData("orbitalDestinationIndex", pointIndex + 1)
            }
        }


        if (entity.age % 80 === 0) {
            global.spawnZombieCrowProjectile(entity, nearestPlayer)
            // player, level, eyePosition, lookAngle
        }

        try {
            let attackingEntity = entity.eyePosition
            let defendingEntity = nearestPlayer.eyePosition
            if (!attackingEntity || !defendingEntity) return
            let attackAngle = global.angleVecFromAToB(attackingEntity, defendingEntity)
            let length = Math.sqrt(attackAngle.x() * attackAngle.x() + attackAngle.z() * attackAngle.z())
            let leftX = -attackAngle.z() / length * 3
            let leftZ = attackAngle.x() / length * 3
            let targetXModified = defendingEntity.x() + leftX
            let targetYModified = defendingEntity.y()
            let targetZModified = defendingEntity.z() + leftZ
            entity.level.spawnParticles("minecraft:smoke", false, targetXModified, targetYModified, targetZModified, 0, 0, 0, 10, 0.1) // some of the particles from explosive enhancements require speed of 1 in order to display

            console.log(`leftside ${targetXModified} ${targetYModified} ${targetZModified}`)
        } catch (err) {
            console.error(`failed ${err}`)
        }

    }

    entity.tickPart("one", entity.getLookAngle().x(), 0.8, entity.getLookAngle().z()) // can you just set this to look angle?
}

StartupEvents.registry('entity_type', event => {
    // frontiers:fireball_entity here references geo/entity/fireball_entity.geo.json and textures/entity/fireball_entity.png
    event.create("frontiers:zombie_crow_projectile", "entityjs:geckolib_projectile")
        .onHitEntity(context => {
            global.zombieCrowProjectileOnHitEntity(context)
        }).onHitBlock(context => {
            global.zombieCrowProjectileOnHitBlock(context)
        }).tick(entity => {
            global.zombieCrowProjectileOnTick(entity)
        }).noItem()
})

global.zombieCrowProjectileOnHitBlock = (context) => {
    const { entity } = context

    const player = entity.getOwner()
    const damageSource = entity.damageSources().mobProjectile(entity, player)
    const world = player.level

    const randomFireballBlockCollisionSound = getRandomSound(fireballCollisionSounds, threeMostRecentFireCollisionSoundSelections)

    world.playSound(entity, entity.block.pos, randomFireballBlockCollisionSound, "players", 3, 1)

    const collisionX = entity.x
    const collisionY = entity.y
    const collisionZ = entity.z

    world.spawnParticles("explosiveenhancement:fireball", false, collisionX, collisionY + 1, collisionZ, 1, 1, 1, 7, 1) // some of the particles from explosive enhancements require speed of 1 in order to display
    world.spawnParticles("explosiveenhancement:smoke", false, collisionX, collisionY + 1, collisionZ, 1, 1, 1, 10, 0.1) // some of the particles from explosive enhancements require speed of 1 in order to display
    world.spawnParticles("explosiveenhancement:blastwave", false, collisionX, collisionY + 1, collisionZ, 1, 1, 1, 3, 1) // some of the particles from explosive enhancements require speed of 1 in order to display

    const RADIUS = 1

    const hitEntity = entity

    const { xsize, ysize, zsize } = hitEntity.boundingBox

    let nearbyEntities = hitEntity.level.getEntitiesWithin(hitEntity.boundingBox.deflate(xsize, ysize, zsize).inflate(ZOMBIE_CROW_PROJECTILE_RADIUS)).filter(entity => entity.living)


    let itemStack = global.getPlayerSpecificData(player, 'mostRecentFireStaffAttackItemstack')
    // let powerEnchantBonusDamage = getFireStaffPowerEnchantmentBonusDamage(itemStack)
    // if (hasKindnessEnchant(itemStack)) {
    //     nearbyEntities = nearbyEntities.filter(entity => !entity.isPlayer())
    // }

    nearbyEntities.forEach((nearbyEntity) => {
        nearbyEntity.setRemainingFireTicks(100)
        nearbyEntity.attack(damageSource, CROW_PROJECTILE_DAMAGE) // this should be explosive attack or fire damage attack

    })

    entity.kill()
}

global.zombieCrowProjectileOnHitEntity = (context) => {
    // 'entity' in this context is the projectile that is spawned
    // 'result.entity' in this context is the target that is hit by the projectile
    const { entity, result } = context;

    // The 'entity' (projectile) has a list of possible damage sources on it, accessed through damageSources()
    // to set the player as the source of damage, we choose .playerAttack() as the damage source,
    // which requires a reference to the player be passed to it.
    // This can be any player reference, in this case we're using entity.getOwner(), 
    // which is a value we set to be the player with this line in global.exampleFinishUsing below when spawning the projectile:
    const player = entity.getOwner()
    const hitEntity = result.entity

    if (hitEntity.type === player.type) {
        console.log(`hitself`)
        return
    }

    const damageSource = entity.damageSources().mobProjectile(entity, player)
    const world = player.level

    const randomFireballCollisionSound = getRandomSound(fireballCollisionSounds, threeMostRecentFireCollisionSoundSelections)

    world.playSound(entity, entity.block.pos, randomFireballCollisionSound, "players", 3, 1)

    const collisionX = result.entity.x
    const collisionY = result.entity.y
    const collisionZ = result.entity.z

    world.spawnParticles("explosiveenhancement:fireball", false, collisionX, collisionY + 1, collisionZ, 1, 1, 1, 7, 1) // some of the particles from explosive enhancements require speed of 1 in order to display
    world.spawnParticles("explosiveenhancement:smoke", false, collisionX, collisionY + 1, collisionZ, 1, 1, 1, 10, 0.1) // some of the particles from explosive enhancements require speed of 1 in order to display
    world.spawnParticles("explosiveenhancement:blastwave", false, collisionX, collisionY + 1, collisionZ, 1, 1, 1, 3, 1) // some of the particles from explosive enhancements require speed of 1 in order to display



    const RADIUS = 1



    const { xsize, ysize, zsize } = hitEntity.boundingBox

    let nearbyEntities = hitEntity.level.getEntitiesWithin(hitEntity.boundingBox.deflate(xsize, ysize, zsize).inflate(ZOMBIE_CROW_PROJECTILE_RADIUS)).filter(entity => entity.living)
    if (!nearbyEntities.contains(hitEntity)) {
        nearbyEntities.push(hitEntity)
    }
    // let itemStack = global.getPlayerSpecificData(player, 'mostRecentFireStaffAttackItemstack')
    // let powerEnchantBonusDamage = getFireStaffPowerEnchantmentBonusDamage(itemStack)
    // console.info(`hasKindnessEnchant ${hasKindnessEnchant(itemStack)}`)
    // if (hasKindnessEnchant(itemStack)) {
    //     nearbyEntities = nearbyEntities.filter(entity => !entity.isPlayer())
    // }

    nearbyEntities.forEach((nearbyEntity) => {
        nearbyEntity.setRemainingFireTicks(100)
        nearbyEntity.attack(damageSource, CROW_PROJECTILE_DAMAGE)
    })

    // we now get rid of the projectile entity
    entity.kill()
}

global.zombieCrowProjectileOnTick = (entity) => {
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

    if (entity.age >= 100) {
        entity.kill()
    }
}

global.spawnZombieCrowProjectile = (entity, target) => {
    const { level, eyePosition } = entity

    const projectile = level.createEntity("frontiers:zombie_crow_projectile");
    // it's crucial to set the projectile entity's owner here, since we're later going to reference this in order to get the damage source
    // console.log(`player ${player}`)
    projectile.setOwner(entity)
    console.log(`owner ${projectile.getOwner()}`)

    // const vel = lookAngle.scale(1.5)

    let attackAngle = global.angleVecFromAToB(eyePosition, target.eyePosition)

    projectile.setMotion(attackAngle.x(), attackAngle.y(), attackAngle.z())
    projectile.setPosition(eyePosition.x(), eyePosition.y(), eyePosition.z())
    projectile.setNoGravity(true)
    projectile.spawn()
}