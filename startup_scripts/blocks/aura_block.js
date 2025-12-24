global.auraBlockPositions = []

StartupEvents.registry("block", event => {
  event.create("frontiers:aura_block").displayName("Aura Block")
})

