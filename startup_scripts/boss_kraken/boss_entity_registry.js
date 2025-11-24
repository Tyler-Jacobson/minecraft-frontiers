// startup_scripts/boss_entity_registry.js
// Registers custom_kraken as a Ghast-based entity, but we *do not* let
// the builder install default goals. Instead, we replicate initGoals()
// in KubeJS using vanilla goal classes.

const BOSS_ID = 'frontiers:custom_kraken'
const BOSS_EGG_ID = 'frontiers:custom_kraken_spawn_egg'
const BOSS_NAME = 'custom_kraken'
const BOSS_WIDTH = 7
const BOSS_HEIGHT = 11

EntityJSEvents.modifyEntity(event => {
  event.modify(BOSS_ID, modifyBuilder => {
    modifyBuilder.defineSyncedData(entity => {
      entity.addSyncedData("string", "Idle", false)
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
    .clientTrackingRange(50)
    .updateInterval(3)
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

      event.addTriggerableAnimation('kraken_idle', 'hurtID', 'default')

      // if (event.entity.hurtTime > 8) {
      //     event.thenPlay('hurt_custom_enderman_geckolib')
      // }
      console.log(`getSyncedData ${event.entity.getSyncedData('Idle')}`)
      // if (!event.isMoving()) {
      //   event.thenLoop('kraken_idle')
      // }

      return true
    })
    .onAddedToWorld(entity => {
      entity.noCulling = true
    })
    .addAnimationController("krakenBossController", 5, e => global.addAnimationController(e, new ResourceLocation(BOSS_ID)))

  // let id = 
  // // builder
  // global.addAnimationController(event, id.path)

  // You can still use other builder hooks here:
  // - builder.animationResource(...)
  // - builder.modelResource(...)
  // - builder.textureResource(...)
  // - builder.onAddedToWorld(...)
  // etc.
})

global.addAnimationController = (event, prefix) => {
  try {
    let entity = event.entity
    let entityIdleData = entity.getSyncedData('Idle')
    event.thenPlayAndHold('kraken_idle')
    // if (entityIdleData) {

    //   entity.setSyncedData('Idle', false)
    //   console.log(`playing idle animation`)
    // }
    return true
  } catch (error) {
    console.log("Error in addAnimationController:", error)
    return true
  }
}