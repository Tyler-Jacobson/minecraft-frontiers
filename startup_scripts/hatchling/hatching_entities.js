StartupEvents.registry('entity_type', event => {


  event.create("frontiers:hatchling_projectile", "entityjs:projectile")
    .onHitBlock(context => {
      const { entity } = context
      const level = entity.level


      const collisionX = entity.x
      const collisionY = entity.y
      const collisionZ = entity.z
      // world.spawnParticles("minecraft:", false, collisionX, collisionY + 1, collisionZ, 1, 1, 1, 7, 1) // some of the particles from explosive enhancements require speed of 1 in order to display
      const projectile = level.createEntity("minecraft:chicken");

      projectile.setPosition(collisionX, collisionY, collisionZ)
      projectile.mergeNbt('{"Age":-12000}')
      projectile.mergeNbt('{"EggLayTime":20000}')
      projectile.spawn()
      level.spawnParticles("minecraft:item frontiers:hatchling", false, collisionX, collisionY + 1, collisionZ, 0.01, 0.01, 0.01, 10, 0.1) // some of the particles from explosive enhancements require speed of 1 in order to display
      entity.kill()
    }).onHitEntity(context => {
      const { entity } = context
      const level = entity.level
      console.info(`running entity code`)

      const collisionX = entity.x
      const collisionY = entity.y
      const collisionZ = entity.z
      // world.spawnParticles("minecraft:", false, collisionX, collisionY + 1, collisionZ, 1, 1, 1, 7, 1) // some of the particles from explosive enhancements require speed of 1 in order to display
      const projectile = level.createEntity("minecraft:chicken");

      projectile.mergeNbt('{"Age":-12000}')
      projectile.mergeNbt('{"EggLayTime":20000}')
      projectile.spawn()
      level.spawnParticles("minecraft:item frontiers:hatchling", false, collisionX, collisionY + 1, collisionZ, 0.01, 0.01, 0.01, 10, 0.1) // some of the particles from explosive enhancements require speed of 1 in order to display
      entity.kill()
    })
    .textureLocation(entity => {
      return "frontiers:textures/entity/projectiles/hatchling.png"
    })
})