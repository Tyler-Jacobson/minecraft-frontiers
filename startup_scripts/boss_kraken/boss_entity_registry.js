// startup_scripts/boss_entity_registry.js
// Registers custom_kraken as a Ghast-based entity, but we *do not* let
// the builder install default goals. Instead, we replicate initGoals()
// in KubeJS using vanilla goal classes.

const BOSS_ID = 'frontiers:custom_kraken'
const BOSS_EGG_ID = 'frontiers:custom_kraken_spawn_egg'
const BOSS_NAME = 'custom_kraken'
const BOSS_WIDTH = 7
const BOSS_HEIGHT = 10

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
      event.addTriggerableAnimation('kraken_red_attack2', 'k_attack', 'default')


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
      let spawnedEntity = entity
      spawnedEntity.persistentData.logCooldown = 0
      console.log(`entity tick log ${spawnedEntity.persistentData.logCooldown}`)
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