let $BlockStateProperties = Java.loadClass('net.minecraft.world.level.block.state.properties.BlockStateProperties')
let IntegerProperty = Java.loadClass('net.minecraft.world.level.block.state.properties.IntegerProperty')

const ZOMBIE_CROW_ID = 'frontiers:zombie_crow'
const ORBIT_RADIUS = 10
const CROW_PROJECTILE_DAMAGE = 5
const ZOMBIE_CROW_PROJECTILE_RADIUS = 2
const ZOMBIE_CROW_EGG_MAX_HEALTH = 200
const ZOMBIE_CROW_EGG_MAX_PHASE = 3

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

            entity.addSyncedData("int", "currentPhase", 0)
            entity.addSyncedData("boolean", "isFleeing", false)

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
    // Part entity tick only — fight/flee logic lives in server-script goals
    entity.tickPart("one", entity.getLookAngle().x(), 0.8, entity.getLookAngle().z())
}

StartupEvents.registry('entity_type', event => {
    // frontiers:fireball_entity here references geo/entity/fireball_entity.geo.json and textures/entity/fireball_entity.png
    event.create("frontiers:zombie_crow_projectile", "entityjs:geckolib_projectile")
        .isAttackable(true)
        .isPickable(true)
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
    global.zombieCrowProjectileTryArrowIntercept(entity)
    if (!entity || !entity.isAlive()) {
        return
    }

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

global.zombieCrowProjectileTryArrowIntercept = entity => {
    if (!entity || !entity.isAlive()) {
        return
    }
    if (entity.level === 'ClientLevel') {
        return
    }

    let readVectorComponent = (vectorValue, componentKey) => {
        if (!vectorValue) {
            return 0
        }
        let componentField = vectorValue[componentKey]
        if (typeof componentField === 'function') {
            return Number(componentField.call(vectorValue)) || 0
        }
        return Number(componentField) || 0
    }

    let distanceSquared = (firstX, firstY, firstZ, secondX, secondY, secondZ) => {
        let deltaX = firstX - secondX
        let deltaY = firstY - secondY
        let deltaZ = firstZ - secondZ
        return (deltaX * deltaX) + (deltaY * deltaY) + (deltaZ * deltaZ)
    }

    let projectileMotion = entity.getDeltaMovement()
    let projectileMotionX = readVectorComponent(projectileMotion, 'x')
    let projectileMotionY = readVectorComponent(projectileMotion, 'y')
    let projectileMotionZ = readVectorComponent(projectileMotion, 'z')

    let projectileCurrentX = entity.x
    let projectileCurrentY = entity.y
    let projectileCurrentZ = entity.z
    let projectilePreviousX = projectileCurrentX - projectileMotionX
    let projectilePreviousY = projectileCurrentY - projectileMotionY
    let projectilePreviousZ = projectileCurrentZ - projectileMotionZ

    let hitboxToCheck = entity.boundingBox.inflate(1.25, 1.25, 1.25)
    let nearbyArrowEntities = entity.level.getEntitiesWithin(hitboxToCheck).filter(nearbyEntity => {
        return nearbyEntity.type === 'minecraft:arrow' || nearbyEntity.type === 'minecraft:spectral_arrow'
    })

    if (!nearbyArrowEntities || nearbyArrowEntities.length === 0) {
        return
    }

    let interceptingArrow = null
    let closestDistanceSquared = Number.MAX_VALUE
    let interceptionDistanceThresholdSquared = 1.35 * 1.35

    for (let arrowIndex = 0; arrowIndex < nearbyArrowEntities.length; arrowIndex++) {
        let currentArrow = nearbyArrowEntities[arrowIndex]
        if (!currentArrow || !currentArrow.isAlive()) {
            continue
        }

        let arrowMotion = currentArrow.getDeltaMovement()
        let arrowMotionX = readVectorComponent(arrowMotion, 'x')
        let arrowMotionY = readVectorComponent(arrowMotion, 'y')
        let arrowMotionZ = readVectorComponent(arrowMotion, 'z')

        let arrowCurrentX = currentArrow.x
        let arrowCurrentY = currentArrow.y
        let arrowCurrentZ = currentArrow.z
        let arrowPreviousX = arrowCurrentX - arrowMotionX
        let arrowPreviousY = arrowCurrentY - arrowMotionY
        let arrowPreviousZ = arrowCurrentZ - arrowMotionZ

        let localClosestDistanceSquared = Math.min(
            distanceSquared(projectileCurrentX, projectileCurrentY, projectileCurrentZ, arrowCurrentX, arrowCurrentY, arrowCurrentZ),
            distanceSquared(projectileCurrentX, projectileCurrentY, projectileCurrentZ, arrowPreviousX, arrowPreviousY, arrowPreviousZ),
            distanceSquared(projectilePreviousX, projectilePreviousY, projectilePreviousZ, arrowCurrentX, arrowCurrentY, arrowCurrentZ),
            distanceSquared(projectilePreviousX, projectilePreviousY, projectilePreviousZ, arrowPreviousX, arrowPreviousY, arrowPreviousZ)
        )

        if (localClosestDistanceSquared < closestDistanceSquared) {
            closestDistanceSquared = localClosestDistanceSquared
            interceptingArrow = currentArrow
        }
    }

    if (!interceptingArrow || closestDistanceSquared > interceptionDistanceThresholdSquared) {
        return
    }

    console.log(`[ZC-TRACE] P6 arrow intercept detected projectile=${entity.uuid} arrow=${interceptingArrow.uuid} arrowType=${interceptingArrow.type} minDistSq=${closestDistanceSquared}`)

    if (interceptingArrow && interceptingArrow.isAlive()) {
        interceptingArrow.kill()
    }

    if (entity.isAlive()) {
        entity.kill()
    }
    console.log(`[ZC-TRACE] P7 arrow intercept resolved projectile_removed=${!entity.isAlive()}`)
}

global.spawnZombieCrowProjectile = (entity, targetX, targetY, targetZ) => {
    const { level, eyePosition } = entity

    const projectile = level.createEntity("frontiers:zombie_crow_projectile");
    // it's crucial to set the projectile entity's owner here, since we're later going to reference this in order to get the damage source
    // console.log(`player ${player}`)
    projectile.setOwner(entity)
    console.log(`owner ${projectile.getOwner()}`)

    // const vel = lookAngle.scale(1.5)

    if (!Number.isFinite(targetX) || !Number.isFinite(targetY) || !Number.isFinite(targetZ)) {
        return
    }
    let targetPosition = new Vec3d(targetX, targetY, targetZ)

    let attackAngle = global.angleVecFromAToB(eyePosition, targetPosition)

    projectile.setMotion(attackAngle.x(), attackAngle.y(), attackAngle.z())
    projectile.setPosition(eyePosition.x(), eyePosition.y(), eyePosition.z())
    projectile.setNoGravity(true)
    projectile.spawn()
}

StartupEvents.registry("block", event => {
    event.create("frontiers:zombie_crow_egg")
        .displayName("Zombie Crow Egg")
        .property(IntegerProperty.create("current_health", 0, ZOMBIE_CROW_EGG_MAX_HEALTH))
        .property(IntegerProperty.create("current_phase", 0, ZOMBIE_CROW_EGG_MAX_PHASE))
        .placementState(event => {
            console.log(`placed egg`)
        })
})