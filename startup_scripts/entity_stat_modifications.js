EntityJSEvents.attributes(event => {
  event.modify("block_factorys_bosses:soul_skeleton", attribute => {
    attribute.add("minecraft:generic.attack_damage", 12)
    attribute.add("minecraft:generic.max_health", 14)
  })
})