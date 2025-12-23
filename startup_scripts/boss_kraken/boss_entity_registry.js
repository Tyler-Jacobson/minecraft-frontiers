// startup_scripts/boss_entity_registry.js
// Registers custom_kraken as a Ghast-based entity, but we *do not* let
// the builder install default goals. Instead, we replicate initGoals()
// in KubeJS using vanilla goal classes.

const BOSS_ID = 'frontiers:custom_kraken'
const BOSS_EGG_ID = 'frontiers:custom_kraken_spawn_egg'
const BOSS_NAME = 'custom_kraken'
const BOSS_WIDTH = 10
const BOSS_HEIGHT = 5

EntityJSEvents.modifyEntity(event => {
  event.modify(BOSS_ID, modifyBuilder => {
    modifyBuilder.defineSyncedData(entity => {
      entity.addSyncedData("string", "Idle", false)
      entity.addSyncedData("string", "Rotation", 0)
    })
  })
})

StartupEvents.registry('entity_type', event => {
  /** @type {Internal.GhastJSBuilder} */
  const builder = event.create(BOSS_ID, 'minecraft:ghast')
    // IMPORTANT: we’ll manage all goals in KubeJS.
    .defaultGoals(false)
    .canChangeDimensions(entity => false)
    .mobCategory('monster')
    .sized(BOSS_WIDTH, BOSS_HEIGHT)
    .clientTrackingRange(1000)
    .updateInterval(1)
    .isPersistenceRequired(true)
    .isAlwaysExperienceDropper(true)
    .canSpawnFarFromPlayer(true)
    .setSummonable(true)
    .saves(true)
    .setDeathSound('minecraft:entity.generic.death')
    .setAmbientSound('minecraft:entity.ghast.ambient')
    .ambientSoundInterval(100)
    .eggItem(item => {
      item.backgroundColor(0x1b1b1b)
      item.highlightColor(0x9c2f2f)
    })
    .addAnimationController('krakenBossController', 1, event => {

      event.addTriggerableAnimation('kraken_idle2', 'k_idle', 'default')
      event.addTriggerableAnimation('kraken_red_attack2', 'k_red_laser', 'default')
      event.addTriggerableAnimation('kraken_yellow', 'k_yellow_laser', 'default')
      event.addTriggerableAnimation('kraken_blue', 'k_blue_laser', 'default')


      // let tickingEntity = event.entity
      // let data = tickingEntity.persistentData


      // if (data.logCooldown === 199) {
      //  console.log(`kraken_idle2 ${data.logCooldown}`)
      //   event.thenPlay('kraken_idle2')
      // }
      // if (data.logCooldown === 99) {
      //  console.log(`kraken_red_attack ${data.logCooldown}`)
      //   event.thenPlay('kraken_red_attack')
      // }

      return true
    })
    .onAddedToWorld(entity => {
      entity.noCulling = true
      entity.noPhysics = true
      let spawnedEntity = entity
      spawnedEntity.persistentData.actionQueue = ['idle']
      spawnedEntity.persistentData.startNextActionAge = 100
      entity.setYaw(0) // needed?
    })
    .tick(entity => {
      // if (!(entity.level === 'ClientLevel')) {
      //   if (entity.age % 100 === 0) {
      //     console.log(`kraken age ${entity.age % 100} is ${entity.age}`)
      //     entity.triggerAnimation('krakenBossController', 'k_idle')
      //   }
      // }

      // let tickingEntity = entity
      // let data = tickingEntity.persistentData
      // // console.log(`entity tick log ${data.logCooldown}`)
      // if (data.logCooldown >= 200) {
      //   console.log(`entity internal clock ${data.logCooldown}`)
      //   data.logCooldown = 0
      // } else {
      //   data.logCooldown++
      // }
    })
  // .addAnimationController("krakenBossController", 5, e => global.addKrakenAnimationController(e, new ResourceLocation(BOSS_ID)))

  const RenderType = Java.loadClass("net.minecraft.client.renderer.RenderType")
  builder.renderType(entity => RenderType.entityTranslucent("frontiers:textures/entity/custom_kraken.png"))
  builder.addPartEntity("one", 10, 12, builder => {
    // Adds an additional hitbox to the entity with builder support
    builder
      .isPickable(true)
      .onPartHurt(context => {
        const { entity, part, source, amount } = context
        // Custom logic for determining how the parts of the entity should relay damage
        // To the entity. For example, relay double the damage to the entity when this hitbox is hit
        entity.attack(source, amount * 1)
        console.log("source: " + source + " amount: " + amount + " part name: " + part.name)
      })
  })
  builder.addPartEntity("two", 10, 8, builder => {
    // Adds an additional hitbox to the entity with builder support
    builder
      .isPickable(true)
      .onPartHurt(context => {
        const { entity, part, source, amount } = context
        // Custom logic for determining how the parts of the entity should relay damage
        // To the entity. For example, relay double the damage to the entity when this hitbox is hit
        entity.attack(source, amount * 1)
        console.log("source: " + source + " amount: " + amount + " part name: " + part.name)
      })
  })
    builder.addPartEntity("three", 20, 4, builder => {
    // Adds an additional hitbox to the entity with builder support
    builder
      .isPickable(true)
      .onPartHurt(context => {
        const { entity, part, source, amount } = context
        // Custom logic for determining how the parts of the entity should relay damage
        // To the entity. For example, relay double the damage to the entity when this hitbox is hit
        entity.attack(source, amount * 1)
        console.log("source: " + source + " amount: " + amount + " part name: " + part.name)
      })
  })
  builder.addPartEntity("four", 20, 4, builder => {
    // Adds an additional hitbox to the entity with builder support
    builder
      .isPickable(true)
      .onPartHurt(context => {
        const { entity, part, source, amount } = context
        // Custom logic for determining how the parts of the entity should relay damage
        // To the entity. For example, relay double the damage to the entity when this hitbox is hit
        entity.attack(source, amount * 1)
        console.log("source: " + source + " amount: " + amount + " part name: " + part.name)
      })
  })
  builder.addPartEntity("five", 10, 4, builder => {
    // Adds an additional hitbox to the entity with builder support
    builder
      .isPickable(true)
      .onPartHurt(context => {
        const { entity, part, source, amount } = context
        // Custom logic for determining how the parts of the entity should relay damage
        // To the entity. For example, relay double the damage to the entity when this hitbox is hit
        entity.attack(source, amount * 1)
        console.log("source: " + source + " amount: " + amount + " part name: " + part.name)
      })
  })
  builder.aiStep(entity => {
    // Tick the previously registered part entity/hitbox to be 1 square y-offset to the entity
    entity.tickPart("one", 0, 12, 0)
    entity.tickPart("two", 0, 4, 0)
    entity.tickPart("three", 0, 0, 0)
    entity.tickPart("four", 0, -4, 0)
    entity.tickPart("five", 0, -8, 0)
  })
  // You can still use other builder hooks here:
  // - builder.animationResource(...)
  // - builder.modelResource(...)
  // - builder.textureResource(...)
  // - builder.onAddedToWorld(...)
  // etc.
})

// global.addKrakenAnimationController = (event, prefix) => {
//   try {
//     let entity = event.entity
//     let entityIdleData = entity.getSyncedData('Idle')
//     event.thenPlay('kraken_idle2')
//     // if (entityIdleData) {

//     //   entity.setSyncedData('Idle', false)
//     //   console.log(`playing idle animation`)
//     // }
//     return true
//   } catch (error) {
//     console.log("Error in addAnimationController:", error)
//     return true
//   }
// }