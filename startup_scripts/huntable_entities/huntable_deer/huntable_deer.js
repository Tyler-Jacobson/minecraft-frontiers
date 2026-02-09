let Vector3 = Java.loadClass("org.joml.Vector3f")
let Vector3d = Java.loadClass("net.minecraft.world.phys.Vec3")
let VanillaGameEvent = Java.loadClass("net.minecraftforge.event.VanillaGameEvent")
let GameEvent = Java.loadClass('net.minecraft.world.level.gameevent.GameEvent')

const HUNTABLE_DEER_ID = 'frontiers:huntable_deer_test'
const HUNTABLE_DEER_EGG_ID = 'frontiers:huntable_deer_test_spawn_egg'
const HUNTABLE_DEER_WIDTH = 0.9
const HUNTABLE_DEER_HEIGHT = 0.9
const HUNTABLE_DEER_DETECTION_RADIUS = 100
const RADIUS_SQ = HUNTABLE_DEER_DETECTION_RADIUS * HUNTABLE_DEER_DETECTION_RADIUS

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
    let vanillaEventInstance = event.getVanillaEvent(); // the GameEvent enum
    let entity = event.getCause()
    let level = event.level
    if (entity && entity.isPlayer() && vanillaEventInstance == GameEvent.STEP && entity.potionEffects.isActive('frontiers:on_the_hunt')) {
        let player = entity
        let box = player.boundingBox.inflate(100)
        let mobs = level.getEntitiesWithin(box)
        let deerList = mobs.filter(mob => {
            return mob.type === HUNTABLE_DEER_ID
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

            console.log(`noise/stealth ${playerDistanceToDeer} ${baseSoundDetectionRange} ${noiseScore} ${stealthScore}`)


            return playerDistanceToDeer < dispatchSoundEventDistance
        })
        deerToDispatchSoundEventList.forEach(deer => {
            // level.spawnParticles("minecraft:vibration", true, 1, 1, 1, 0, 0, 0, 1, 0)
            Utils.server.runCommandSilent(`execute in ${entity.level.getDimension()} positioned ${player.x} ${player.y} ${player.z} run particle minecraft:vibration ${deer.x} ${deer.y + 1} ${deer.z} ${20}`)
            let currentDeerAlertness = deer.getSyncedData('alertness')
            deer.setSyncedData('alertness', currentDeerAlertness + 10)
        })
    }
});

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

            if (entity.age % 100 === 0) { // apply 'On the Hunt' status to nearby players every 5 seconds
                let level = entity.level
                try {
                    let nearbyPlayers = level.getPlayers(player =>
                        player.distanceToSqr(entity) <= RADIUS_SQ
                    )
                    nearbyPlayers.forEach((player) => {
                        player.potionEffects.add("frontiers:on_the_hunt", 200, 0, false, true)
                    })
                    let currentDeerAlertness = entity.getSyncedData('alertness')

                    console.log(`currentDeerAlertness ${currentDeerAlertness}`)
                } catch (err) {
                    console.log(`error trying to apply on the hunt status to player ${err}`)
                }
            }
        }


    })
    builder.createNavigation(context => EntityJSUtils.createAmphibiousPathNavigation(context.entity, context.level))
})

global.runOnHurt = context => {
    if (context.damageSource.getPlayer()) {
        // entity instantly becomes alert on damaged by player
        context.entity.setSyncedData('alertness', 1000)
    }
}


// StartupEvents.registry('entity_type', event => {
//   /** @type {Internal.GhastJSBuilder} */
//   const builder = event.create(HUNTABLE_DEER_ID, 'entityjs:animal')
//     // IMPORTANT: we’ll manage all goals in KubeJS.
//     .canChangeDimensions(entity => false)
//     .mobCategory('creature')
//     .sized(HUNTABLE_DEER_WIDTH, HUNTABLE_DEER_HEIGHT)
//     .clientTrackingRange(1000)
//     .updateInterval(1)
//     .isPersistenceRequired(true)
//     .isAlwaysExperienceDropper(true)
//     .canSpawnFarFromPlayer(true)
//     .setSummonable(true)
//     .saves(true)
//     .setDeathSound('minecraft:entity.generic.death')
//     .setAmbientSound('block_factorys_bosses:sandworm_ambient')
//     .setHurtSound(() => 'block_factorys_bosses:sandworm_hurt')
//     .setSoundVolume(1)
//     .ambientSoundInterval(100)
//     .fireImmune(true)
//     .eggItem(item => {
//       item.backgroundColor(0xff0000)
//       item.highlightColor(0xffbe8f)
//     })
//     .addAnimationController('krakenBossController', 1, event => {

//     //   event.addTriggerableAnimation('kraken_idle2', 'k_idle', 'default')
//     //   event.addTriggerableAnimation('kraken_red_attack2', 'k_red_laser', 'default')
//     //   event.addTriggerableAnimation('kraken_yellow', 'k_yellow_laser', 'default')
//     //   event.addTriggerableAnimation('kraken_blue', 'k_blue_laser', 'default')


//       // let tickingEntity = event.entity
//       // let data = tickingEntity.persistentData


//       // if (data.logCooldown === 199) {
//       //  console.log(`kraken_idle2 ${data.logCooldown}`)
//       //   event.thenPlay('kraken_idle2')
//       // }
//       // if (data.logCooldown === 99) {
//       //  console.log(`kraken_red_attack ${data.logCooldown}`)
//       //   event.thenPlay('kraken_red_attack')
//       // }

//       return true
//     })
//     .onAddedToWorld(entity => {
//         console.log(`added ${entity} to world`)
//     //   entity.noCulling = true
//     //   entity.noPhysics = true
//     //   let spawnedEntity = entity
//     //   spawnedEntity.persistentData.actionQueue = ['blue']
//     //   spawnedEntity.persistentData.startNextActionAge = 100
//     //   spawnedEntity.persistentData.startNextSummonActionAge = 100
//     //   entity.setYaw(0) // needed?
//     })
//     .tick(entity => {
//       // if (!(entity.level === 'ClientLevel')) {
//       //   if (entity.age % 100 === 0) {
//       //     console.log(`kraken age ${entity.age % 100} is ${entity.age}`)
//       //     entity.triggerAnimation('krakenBossController', 'k_idle')
//       //   }
//       // }

//       // let tickingEntity = entity
//       // let data = tickingEntity.persistentData
//       // // console.log(`entity tick log ${data.logCooldown}`)
//       // if (data.logCooldown >= 200) {
//       //   console.log(`entity internal clock ${data.logCooldown}`)
//       //   data.logCooldown = 0
//       // } else {
//       //   data.logCooldown++
//       // }
//     })
//   // .addAnimationController("krakenBossController", 5, e => global.addKrakenAnimationController(e, new ResourceLocation(HUNTABLE_DEER_ID)))

//   const RenderType = Java.loadClass("net.minecraft.client.renderer.RenderType")
//   builder.renderType(entity => RenderType.entityTranslucent("frontiers:textures/entity/huntable_deer_test.png"))
//   builder.addPartEntity("one", 1, 2, builder => {
//     // Adds an additional hitbox to the entity with builder support
//     builder
//       .isPickable(true)
//       .onPartHurt(context => {
//         const { entity, part, source, amount } = context
//         // Custom logic for determining how the parts of the entity should relay damage
//         // To the entity. For example, relay double the damage to the entity when this hitbox is hit
//         const damageOut = amount * 2
//         entity.attack(source, damageOut)
//         console.log(`Headshot! ${damageOut}`)
//       })
//   })
//   builder.aiStep(entity => {
//     // Tick the previously registered part entity/hitbox to be 1 square y-offset to the entity
//     entity.tickPart("one", 0, 1, 0)
//   })
//   // You can still use other builder hooks here:
//   // - builder.animationResource(...)
//   // - builder.modelResource(...)
//   // - builder.textureResource(...)
//   // - builder.onAddedToWorld(...)
//   // etc.
// })
