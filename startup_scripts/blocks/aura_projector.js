global.auraProjectorBlockPositions = []

const AURA_PROJECTOR_RADIUS = 2
const AURA_PROJECTOR_Y_OFFSET = 1
const AURA_PROJECTOR_TICK_DELAY = true

StartupEvents.registry("block", event => {
  event.create("frontiers:aura_projector").displayName("Aura Projector")
})

StartupEvents.registry("block", event => {
  event.create("frontiers:tick_logger_block")
    .displayName("Tick Logger Block")
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
          let particleX = posX + 0.5 + Math.cos(angle) * AURA_PROJECTOR_RADIUS
          let particleZ = posZ + 0.5 + Math.sin(angle) * AURA_PROJECTOR_RADIUS
          // console.log(`spawning particles at ${particleX} ${pos[1] + 0.2} ${particleZ}`)
          if (AURA_PROJECTOR_TICK_DELAY) {
            console.log(`${Object.keys(level)}`)
            if (!(level === 'ClientLevel')) {
              level.server.scheduleInTicks(step, () => {
                level.spawnParticles("call_of_yucutan:rain_wisp", true, particleX, posY + AURA_PROJECTOR_Y_OFFSET, particleZ, 0, 0, 0, 1, 0)
              })
            }
          } else {
            level.spawnParticles("call_of_yucutan:rain_wisp", true, particleX, posY + AURA_PROJECTOR_Y_OFFSET, particleZ, 0, 0, 0, 1, 0)
          }
        }
      })
    })
})