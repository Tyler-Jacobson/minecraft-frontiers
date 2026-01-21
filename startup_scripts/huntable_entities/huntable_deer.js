let Vector3 = Java.loadClass("org.joml.Vector3f")
let Vector3d = Java.loadClass("net.minecraft.world.phys.Vec3")



const HUNTABLE_DEER_ID = 'frontiers:huntable_deer_test'
const HUNTABLE_DEER_EGG_ID = 'frontiers:huntable_deer_test_spawn_egg'
const HUNTABLE_DEER_WIDTH = 2
const HUNTABLE_DEER_HEIGHT = 1

EntityJSEvents.modifyEntity(event => {
    event.modify('frontiers:huntable_deer_test', modifyBuilder => {
        modifyBuilder.defineSyncedData(entity => {
            entity.addSyncedData("int", "ownerBlockLocationX", 0)
            entity.addSyncedData("int", "ownerBlockLocationY", 0)
            entity.addSyncedData("int", "ownerBlockLocationZ", 0)
            // entity.addSyncedData("uuid", "ParentUUID", UUID.fromString("ef1e3ec3-cf9e-48c0-bef4-21aae262a7b2"))
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

        .tick(entity => {

        })
    builder.onAddedToWorld(entity => {
        console.log(`added ${entity} to world`)
        // console.log(`owner block ${entity.getSyncedData('ownerBlockLocationX')}`)

    })
    builder.newGeoLayer(builder => {
        // builder.render(context => global.geoLayerRender(context))
        builder.textureResource(e => `frontiers:textures/entity/huntable_deer_test.png`)
    })
    builder.addPartEntity("head", 1, 1, builder => {
        // Adds an additional hitbox to the entity with builder support
        builder
            .isPickable(true)
            .onPartHurt(context => {
                const { entity, part, source, amount } = context
                // Custom logic for determining how the parts of the entity should relay damage
                // To the entity. For example, relay double the damage to the entity when this hitbox is hit
                entity.attack(source, amount * 2)
                // console.log("source: " + source + " amount: " + amount + " part name: " + part.name)
                console.log(`damaged owner block ${entity.getSyncedData('ownerBlockLocationX')} ${entity.getSyncedData('ownerBlockLocationY')} ${entity.getSyncedData('ownerBlockLocationZ')}`)

            })
    })
    builder.aiStep(entity => {
        // builder.aiStep runs on the entity every tick
        entity.tickPart("head", 0, 1, 0)
        entity.goalSelector.setNewGoalRate(100)
        // console.log(`goal selector newGoalRate ${entity.goalSelector.newGoalRate}`)
    })
})



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
