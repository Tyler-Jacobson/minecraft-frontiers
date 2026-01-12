const KRAKEN_AURA_RADIUS = 2
const KRAKEN_AURA_Y_OFFSET = 1
const KRAKEN_AURA_TICK_DELAY = true

StartupEvents.registry("block", event => {
  event.create("frontiers:aura_projector").displayName("Aura Projector")
})

function findEntitiesWithinBlocks(level, coordinateX, coordinateY, coordinateZ, cubeRadius) {
  return level.getEntitiesWithin(AABB.of(coordinateX - cubeRadius, coordinateY - cubeRadius, coordinateZ - cubeRadius, coordinateX + cubeRadius, coordinateY + cubeRadius, coordinateZ + cubeRadius))
}

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
        if (level.time % 10 === 0) {
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
        }
        if (level.time % 100 === 0) {
          let entitiesNearBlock = findEntitiesWithinBlocks(level, posX, posY, posZ, 20)
          if (!(level === 'ClientLevel')) {
            if (!entitiesNearBlock.length) return
            let filteredEntities = entitiesNearBlock.filter(entity => {
              return entity.isPlayer()
            })
            if (filteredEntities.length) {
              filteredEntities.forEach(player => {
                let playerEyePos = player.getEyePosition()
                let attackStartingLocation = new Vec3d(posX, posY + 2, posZ)
                let attackAngle = global.angleVecFromAToB(attackStartingLocation, playerEyePos)
                spawnKrakenAuraProjectile(player, level, attackStartingLocation, attackAngle) // need to change the owner of the projectile from player -> kraken. Or at least nothing

              })
            }
          }
          // let nearestPlayer = entity.level.getNearestPlayer(entity, 128)
          // let nearestPlayerEyePos = nearestPlayer.getEyePosition()
          // let attackStartingLocation = mobRelativeLocation(entity, 0, 3, 0)

          // console.log(`nearestPlayerEyePos ${nearestPlayerEyePos}`)
          // let playerLocationWithOffset = new Vec3d(nearestPlayerEyePos.x(), nearestPlayerEyePos.y(), nearestPlayerEyePos.z())
          // let attackAngle = global.angleVecFromAToB(attackStartingLocation, playerLocationWithOffset)
          // spawnKrakenRedProjectile(entity, entity.level, attackStartingLocation, attackAngle)
        }
      })
    })
})

const spawnKrakenAuraProjectile = (mob, level, attackStartingLocation, lookAngle) => {
    // const { level } = mob
    const projectile = level.createEntity("frontiers:kraken_red_projectile");
    // it's crucial to set the projectile entity's owner here, since we're later going to reference this in order to get the damage source
    projectile.setOwner(mob)
    const vel = lookAngle.scale(0.5)
    projectile.setMotion(vel.x(), vel.y(), vel.z())
    projectile.setPosition(attackStartingLocation.x(), attackStartingLocation.y(), attackStartingLocation.z())
    projectile.setNoGravity(true)
    projectile.spawn()
}