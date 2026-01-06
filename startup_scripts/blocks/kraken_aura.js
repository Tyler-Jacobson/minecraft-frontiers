const KRAKEN_AURA_RADIUS = 2
const KRAKEN_AURA_Y_OFFSET = 1
const KRAKEN_AURA_TICK_DELAY = true

StartupEvents.registry("block", event => {
  event.create("frontiers:aura_projector").displayName("Aura Projector")
})

StartupEvents.registry("block", event => {
  event.create("frontiers:kraken_aura")
    .displayName("Kraken Aura Block")
    .blockEntity(entityInfo => { // also has tick and serverTick methods
      entityInfo.tick(1, 0, entity => {
        let level = entity.level
        // console.log(`${Object.keys(entity.level)}`)
        let posX = entity.x
        let posY = entity.y
        let posZ = entity.z
        if (level.time % 10 != 0) return
        for (let step = 0; step < 12; step++) {
          let angle = step * JavaMath.PI * 2 / 12
          let particleX = posX + 0.5 + Math.cos(angle) * KRAKEN_AURA_RADIUS
          let particleZ = posZ + 0.5 + Math.sin(angle) * KRAKEN_AURA_RADIUS
          // console.log(`spawning particles at ${particleX} ${pos[1] + 0.2} ${particleZ}`)
          if (KRAKEN_AURA_TICK_DELAY) {
            // console.log(`${Object.keys(level)}`)
            if (!(level === 'ClientLevel')) {
              level.server.scheduleInTicks(step, () => {
                level.spawnParticles("call_of_yucutan:rain_wisp", true, particleX, posY + KRAKEN_AURA_Y_OFFSET, particleZ, 0, 0, 0, 1, 0)
              })
            }
          } else {
            level.spawnParticles("call_of_yucutan:rain_wisp", true, particleX, posY + KRAKEN_AURA_Y_OFFSET, particleZ, 0, 0, 0, 1, 0)
          }
        }
      })
    })
})