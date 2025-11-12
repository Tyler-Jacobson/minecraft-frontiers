// startup_scripts/boss_entity_registry.js
// Registers custom_kraken as a Ghast-based entity, but we *do not* let
// the builder install default goals. Instead, we replicate initGoals()
// in KubeJS using vanilla goal classes.

const BOSS_ID      = 'frontiers:custom_kraken'
const BOSS_EGG_ID  = 'frontiers:custom_kraken_spawn_egg'
const BOSS_NAME    = 'custom_kraken'
const BOSS_WIDTH   = 7
const BOSS_HEIGHT  = 11

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

    // You can still use other builder hooks here:
  // - builder.animationResource(...)
  // - builder.modelResource(...)
  // - builder.textureResource(...)
  // - builder.onAddedToWorld(...)
  // etc.
})