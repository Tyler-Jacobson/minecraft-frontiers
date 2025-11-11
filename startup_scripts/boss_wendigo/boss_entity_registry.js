// startup_scripts/boss_entity_registry.js
// Registers custom_kraken as a Ghast-based EntityJS mob,
// so it inherits *vanilla Ghast AI* (floating + fireballs)
// and we can tweak behavior via goal events.

const BOSS_ID      = 'frontiers:custom_kraken'
const BOSS_EGG_ID  = 'frontiers:custom_kraken_spawn_egg'
const BOSS_NAME    = 'custom_kraken'
const BOSS_WIDTH   = 7   // hitbox width in blocks
const BOSS_HEIGHT  = 11  // hitbox height in blocks

StartupEvents.registry('entity_type', event => {
  // NOTE: we use the Ghast builder type here:
  //   "minecraft:ghast" -> GhastJSBuilder -> GhastEntityJS (extends Ghast)
  //
  // That means:
  //   - builder.defaultGoals(true) will call Ghast.registerGoals()
  //     and install *all* vanilla Ghast AI goals.
  //   - our KubeJS/EntityJS goal scripts will run *after* that,
  //     so we can add/remove/override goals cleanly.

  /** @type {Internal.GhastJSBuilder} */
  const builder = event.create(BOSS_ID, 'minecraft:ghast')
    .defaultGoals(true)              // inherit vanilla Ghast goals
    .mobCategory('monster')          // still a hostile monster
    .sized(BOSS_WIDTH, BOSS_HEIGHT)  // huge kraken hitbox
    .clientTrackingRange(50)
    .updateInterval(3)
    .isPersistenceRequired(true)
    .isAlwaysExperienceDropper(true)
    .canSpawnFarFromPlayer(true)
    .setSummonable(true)
    .saves(true)
    // Sounds – you can swap these to your own IDs
    .setDeathSound('minecraft:entity.generic.death')
    .setAmbientSound('minecraft:entity.ghast.ambient')
    .ambientSoundInterval(100)

    // Optional: custom spawn egg styling
    .eggItem(item => {
      item.backgroundColor(0x1b1b1b)  // dark background
      item.highlightColor(0x9c2f2f)   // red highlight
    })

  // You can still use other builder hooks here:
  // - builder.animationResource(...)
  // - builder.modelResource(...)
  // - builder.textureResource(...)
  // - builder.onAddedToWorld(...)
  // etc.
})