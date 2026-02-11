let Vector3 = Java.loadClass("org.joml.Vector3f")
let Vector3d = Java.loadClass("net.minecraft.world.phys.Vec3")
let VanillaGameEvent = Java.loadClass("net.minecraftforge.event.VanillaGameEvent")
let GameEvent = Java.loadClass('net.minecraft.world.level.gameevent.GameEvent')
let TameableMobJS = Java.loadClass('net.liopyu.entityjs.entities.living.entityjs.TameableMobJS')
let ClipContext = Java.loadClass('net.minecraft.world.level.ClipContext')
let HitResult = Java.loadClass('net.minecraft.world.phys.HitResult')
// net/minecraft/world/level/ClipContext.java

const HUNTABLE_DEER_ID = 'frontiers:huntable_deer_test'
const HUNTABLE_DEER_EGG_ID = 'frontiers:huntable_deer_test_spawn_egg'
const HUNTABLE_DEER_WIDTH = 0.9
const HUNTABLE_DEER_HEIGHT = 0.9
const HUNTABLE_DEER_DETECTION_RADIUS = 100
const RADIUS_SQ = HUNTABLE_DEER_DETECTION_RADIUS * HUNTABLE_DEER_DETECTION_RADIUS
const VISION_CONE_WIDTH_BLOCKS = 10

const STEALTH_TWO_ITEMS = [
    'minecraft:leather_helmet',
    'minecraft:leather_chestplate',
    'minecraft:leather_leggings',
    'minecraft:leather_boots'
]

const NOISE_TWO_ITEMS = [ // check back before release. need to add all armors to these
    'minecraft:iron_helmet',
    'minecraft:iron_chestplate',
    'minecraft:iron_leggings',
    'minecraft:iron_boots',

    'minecraft:golden_helmet',
    'minecraft:golden_chestplate',
    'minecraft:golden_leggings',
    'minecraft:golden_boots',

    'minecraft:diamond_helmet',
    'minecraft:diamond_chestplate',
    'minecraft:diamond_leggings',
    'minecraft:diamond_boots',

    'minecraft:netherite_helmet',
    'minecraft:netherite_chestplate',
    'minecraft:netherite_leggings',
    'minecraft:netherite_boots',

    'dungeonnowloading:spawner_helmet',
    'dungeonnowloading:spawner_chestplate',
    'dungeonnowloading:spawner_leggings',
    'dungeonnowloading:spawner_boots',
]

NativeEvents.onEvent(VanillaGameEvent, event => { // here
    global.runOnStepEvent(event)
});

global.runOnStepEvent = (event) => {
    let vanillaEventInstance = event.getVanillaEvent(); // the GameEvent enum
    let entity = event.getCause()
    let level = event.level
    if (entity && entity.isPlayer() && vanillaEventInstance == GameEvent.STEP && entity.potionEffects.isActive('frontiers:on_the_hunt')) {
        let player = entity
        let box = player.boundingBox.inflate(100)
        let mobs = level.getEntitiesWithin(box)
        let deerList = mobs.filter(mob => {
            return mob.type === HUNTABLE_DEER_ID && mob instanceof TameableMobJS
        })
        let deerToDispatchSoundEventList = deerList.filter(deer => {
            // stealth and noise modifiers should be handled in here
            let stealthScore = 0
            let noiseScore = 0
            let baseSoundDetectionRange = deer.getSyncedData('baseSoundDetectionRange')
            let playerDistanceToDeer = player.distanceToEntity(deer)
            // console.log(`HuntStep is it true??`)

            let stealthTwoItemsCount = player.getArmorSlots().filter(armorSlot => {
                // console.log(`armor slot ${Object.keys(armorSlot)}`)
                // console.log(`armor slot ${armorSlot.getItem().id}`)
                return STEALTH_TWO_ITEMS.includes(armorSlot.getItem().id)
            })

            let noiseTwoItemsCount = player.getArmorSlots().filter(armorSlot => {
                // console.log(`armor slot ${Object.keys(armorSlot)}`)
                // console.log(`armor slot ${armorSlot.getItem().id}`)
                return NOISE_TWO_ITEMS.includes(armorSlot.getItem().id)
            })
            stealthScore += stealthTwoItemsCount.length * 2
            noiseScore += noiseTwoItemsCount.length * 2



            if (player.isCrouching()) {
                // console.log(`crouchstep`)
                stealthScore += 8
            }
            if (player.isSprinting()) {
                // console.log(`sprintstep`)
                noiseScore += 8
            }

            let dispatchSoundEventDistance = baseSoundDetectionRange + noiseScore - stealthScore

            // console.log(`noise/stealth ${playerDistanceToDeer} ${baseSoundDetectionRange} ${noiseScore} ${stealthScore}`)


            return playerDistanceToDeer < dispatchSoundEventDistance
        })
        deerToDispatchSoundEventList.forEach(deer => {
            // level.spawnParticles("minecraft:vibration", true, 1, 1, 1, 0, 0, 0, 1, 0)
            Utils.server.runCommandSilent(`execute in ${entity.level.getDimension()} positioned ${player.x} ${player.y} ${player.z} run particle minecraft:vibration ${deer.x} ${deer.y + 1} ${deer.z} ${20}`)
            let currentDeerAlertness = deer.getSyncedData('alertness')
            deer.setSyncedData('alertness', currentDeerAlertness + 10)
        })
    }
}

EntityJSEvents.createAttributes(event => {
    /**
     * Add or update default attributes for the entity type.
     * Existing attributes are preserved, and new ones are merged in.
     */
    event.create(HUNTABLE_DEER_ID, attribute => {
        attribute.add("minecraft:generic.max_health", 15)
        attribute.add("minecraft:generic.movement_speed", 0.5)
    })
})

EntityJSEvents.modifyEntity(event => {
    event.modify(HUNTABLE_DEER_ID, modifyBuilder => {
        modifyBuilder.defineSyncedData(entity => {
            entity.addSyncedData("int", "ownerBlockLocationX", 0)
            entity.addSyncedData("int", "ownerBlockLocationY", 0)
            entity.addSyncedData("int", "ownerBlockLocationZ", 0)
            // entity.addSyncedData("uuid", "ParentUUID", UUID.fromString("ef1e3ec3-cf9e-48c0-bef4-21aae262a7b2"))
            entity.addSyncedData("int", "lastTickLocationX", 0)
            entity.addSyncedData("int", "lastTickLocationY", 0)
            entity.addSyncedData("int", "lastTickLocationZ", 0)
            entity.addSyncedData("int", "timeSpentAtCurrentLocation", 0)

            entity.addSyncedData("int", "baseSoundDetectionRange", 24)
            entity.addSyncedData("int", "alertness", 0)

            entity.addSyncedData("int", "timeSpentEating", 0)

            entity.addSyncedData("string", "headUUID", "default")


        })
    })
})

StartupEvents.registry('entity_type', event => {
    const builder = event.create(HUNTABLE_DEER_ID, 'entityjs:tamable')
        .mobCategory('creature')
        .sized(HUNTABLE_DEER_WIDTH, HUNTABLE_DEER_HEIGHT)
        .eggItem(item => {
            item.backgroundColor(0xff0000)
            item.highlightColor(0xffbe8f)
        })
        .tick(entity => { })
        .onAddedToWorld(entity => { // onAddedToWorld never seems to run
        })
    builder.newGeoLayer(builder => {
        // builder.render(context => global.geoLayerRender(context))
        builder.textureResource(e => `frontiers:textures/entity/huntable_deer_test.png`)
    })
    builder.onHurt(context => {
        // Log the amount of damage received by the entity
        global.runOnHurt(context)
    })
    builder.aiStep(entity => {
        global.runHuntableDeerTick(entity)
    })
    builder.createNavigation(context => EntityJSUtils.createAmphibiousPathNavigation(context.entity, context.level))
    builder.dropCustomDeathLoot(context => {
        context.entity.block.popItemFromFace('butchersdelight:dead_cow', 'up')
    })
    builder.addPartEntity("one", 1.2, 1.2, builder => {
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

global.runOnHurt = context => {
    if (context.damageSource.getPlayer()) {
        // entity instantly becomes alert on damaged by player
        context.entity.setSyncedData('alertness', 1000)
    }
}

global.runHuntableDeerTick = entity => {
    if (!(entity.level === 'ClientLevel')) {
        let lastTickX = entity.getSyncedData("lastTickLocationX")
        let lastTickZ = entity.getSyncedData("lastTickLocationZ")
        let currentTickX = Math.floor(entity.x)
        let currentTickZ = Math.floor(entity.z)
        if (currentTickX === lastTickX && currentTickZ === lastTickZ) { // used for unstuck check
            let timeAtLocation = entity.getSyncedData("timeSpentAtCurrentLocation")
            entity.setSyncedData("timeSpentAtCurrentLocation", timeAtLocation + 1)
        } else {
            entity.setSyncedData("timeSpentAtCurrentLocation", 0)
        }
        entity.setSyncedData("lastTickLocationX", Math.floor(entity.x))
        entity.setSyncedData("lastTickLocationY", Math.floor(entity.y))
        entity.setSyncedData("lastTickLocationZ", Math.floor(entity.z))

        if (entity.age % 20 === 0) { // apply 'On the Hunt' status to nearby players every 5 seconds
            let level = entity.level
            try {
                let nearbyPlayers = level.getPlayers(player =>
                    player.distanceToSqr(entity) <= RADIUS_SQ
                )
                nearbyPlayers.forEach((player) => {
                    player.potionEffects.add("frontiers:on_the_hunt", 200, 0, false, true)
                })
                global.spawnParticleTrail(entity) // sends particles from block to huntable mobs
                // console.log(`currentDeerAlertness ${currentDeerAlertness}`)
            } catch (err) {
                console.log(`error trying to apply on the hunt status to player ${err}`)
            }
        }

        if (entity.age % 20 === 0) {
            let level = entity.level
            try {
                let nearbyHuntingPlayers = level.getPlayers(player => {
                    return player.distanceToSqr(entity) <= RADIUS_SQ && player.potionEffects.isActive('frontiers:on_the_hunt')
                })
                let playersInVisionCone = nearbyHuntingPlayers.filter((player) => {
                    let playerDistanceFromMob = player.distanceToEntity(entity)
                    // console.log(`playerDistanceFromMob ${playerDistanceFromMob}`)

                    let lookVector = entity.getLookAngle().scale(playerDistanceFromMob)
                    let entityPosition = entity.position()
                    let targetLocation = entityPosition.add(lookVector)

                    level.spawnParticles("call_of_yucutan:rain_wisp", true, targetLocation.x(), targetLocation.y(), targetLocation.z(), 1, 1, 1, 20, 1)
                    // console.log(targetLocation)

                    let distanceBetweenSqr = player.distanceToSqr(targetLocation)
                    let distanceBetween = Math.sqrt(distanceBetweenSqr)
                    // console.log(`distanceBetweenSqr ${distanceBetween}`)
                    return distanceBetween < VISION_CONE_WIDTH_BLOCKS
                })
                let playersEntityCanSee = playersInVisionCone.filter(player => {
                    let start = player.getEyePosition()
                    let end = entity.getEyePosition()
                    let clipContext = new ClipContext(
                        start,
                        end,
                        ClipContext.Block.COLLIDER,   // consider solid blocks
                        ClipContext.Fluid.NONE,       // or Fluid.ANY if needed
                        entity                       // entity to ignore
                    );
                    // draw a raycast between player eye pos and entity eye pos
                    let result = level.clip(clipContext);

                    // if raycast is stopped by a block, result.getType() will be HitResult.Type.BLOCK
                    let blocked = result.getType() === HitResult.Type.BLOCK;

                    // if the raycast isn't stopped by a block, return true, adding the player to the filtered list of visible players
                    console.log(`can entity see player is ${!blocked}`)
                    return !blocked
                })
                if (playersEntityCanSee.length) {
                    global.increaseAlertness(entity, playersEntityCanSee[0], 10)
                }


                console.log(`playersInVisionCone ${playersInVisionCone}`)
                // console.log(`currentDeerAlertness ${currentDeerAlertness}`)
            } catch (err) {
                console.log(`error trying to apply on the hunt status to player ${err}`)
            }
        }
    }

    entity.tickPart("one", entity.getLookAngle().x(), 0.8, entity.getLookAngle().z()) // can you just set this to look angle?
}

// global.spawnParticleTrail = (entity, player) => {
//     let startPosition = player.position()
//     let endPosition = entity.position()
//     let stepCount = 10
//     let stepVector = endPosition.subtract(startPosition).scale(1 / stepCount)

//     for (let stepIndex = 0; stepIndex <= stepCount; stepIndex++) {
//         let particlePosition = startPosition.add(stepVector.scale(stepIndex))
//         // entity.level.spawnParticles("minecraft:crit", particlePosition.x, particlePosition.y, particlePosition.z, 1, 0, 0, 0, 0)
//         player.level.spawnParticles("minecraft:smoke", false, particlePosition.x(), particlePosition.y(), particlePosition.z(), 0, 0, 0, 1, 0) // last 2 are count / speed

//     }
// }

global.spawnParticleTrail = (entity) => {
    let level = entity.level
    let targetX = entity.getSyncedData('ownerBlockLocationX')
    let targetY = entity.getSyncedData('ownerBlockLocationY')
    let targetZ = entity.getSyncedData('ownerBlockLocationZ')

    let startPosition = new Vec3d(targetX, targetY, targetZ)
    let endPosition = new Vec3d(entity.x, entity.y + 2, entity.z)
    let stepCount = 40
    let directionVector = endPosition.subtract(startPosition)
    let stepVector = directionVector.scale(1 / stepCount)

    for (let stepIndex = 0; stepIndex <= stepCount; stepIndex++) {
        let progress = stepIndex / stepCount
        let angle = progress * 12
        let radius = 3
        let radiusY = 1
        let offsetX = Math.cos(angle) * radius
        let offsetY = Math.sin(angle) * radiusY
        let particlePosition = startPosition.add(stepVector.scale(stepIndex)).add(offsetX, offsetY, 0)
        level.server.scheduleInTicks(stepIndex * 1, () => {
            level.spawnParticles("minecraft:smoke", false, particlePosition.x(), particlePosition.y() + 1, particlePosition.z(), 0, 0, 0, 1, 0) // last 2 are count / speed

        })
    }
}

global.increaseAlertness = (entity, player, amount) => {
    if (entity && player && entity.isAlive() && player.isAlive()) {
        let currentAlertness = entity.getSyncedData('alertness')
        entity.setSyncedData('alertness', currentAlertness + amount)
        entity.lookAt(player, 30, 30)
        // may need to do some client side handling for smooth look at
    } else {
        console.warn(`unable to increase alertness, player or entity is null or dead`)
    }
}