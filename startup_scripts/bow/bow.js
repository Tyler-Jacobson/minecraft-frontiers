
// StartupEvents.registry('entity_type', event => {
//     // frontiers:fireball_entity here references geo/entity/fireball_entity.geo.json and textures/entity/fireball_entity.png
//     event.create("minecraft:arrow", "entityjs:arrow").onHitEntity(entity => {
//         console.info(`arrow hit entity`)

//     }).tick(entity => {
//         // console.info(`ticking arrow`)
//         const world = entity.level

//         const collisionX = entity.x
//         const collisionY = entity.y
//         const collisionZ = entity.z

//         if (entity.age === 3) {
//             world.playSound(entity, entity.block.pos, 'frontiers:fire_staff_fireball_projectile_whoosh', "players", 1, 1)
//         }

//         const smokeParticleYOffset = 0.3
//         const smokeParticleCountPerTick = 1
//         const smokeParticleSpeedPerTick = 0

//         const lavaParticleCountPerTick = 1
//         const lavaParticleSpeedPerTick = 20

//         world.spawnParticles("minecraft:smoke", false, collisionX, collisionY + smokeParticleYOffset, collisionZ, 0, 0, 0, smokeParticleCountPerTick, smokeParticleSpeedPerTick)
//         world.spawnParticles("minecraft:lava", false, collisionX, collisionY, collisionZ, 0, 0, 0, lavaParticleCountPerTick, lavaParticleSpeedPerTick)
//     })
// })