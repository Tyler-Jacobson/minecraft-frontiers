const ZOMBIE_CROW_ID = 'frontiers:zombie_crow'
const ORBIT_RADIUS = 10

EntityJSEvents.modifyEntity(event => {
    event.modify(ZOMBIE_CROW_ID, modifyBuilder => {
        modifyBuilder.defineSyncedData(entity => {
            entity.addSyncedData("string", "headUUID", "default")
            entity.addSyncedData("int", "orbitalDestinationIndex", 0)

        })
    })
})

StartupEvents.registry('entity_type', event => {
    const builder = event.create(ZOMBIE_CROW_ID, 'entityjs:tamable')
        .mobCategory('creature')
        .sized(0.9, 0.9)
        .eggItem(item => {
            item.backgroundColor(0xff0000)
            item.highlightColor(0xffbe8f)
        })
        .tick(entity => { })
        .onAddedToWorld(entity => { // onAddedToWorld never seems to run
        })
    builder.newGeoLayer(builder => {
        // builder.render(context => global.geoLayerRender(context))
        builder.textureResource(e => `frontiers:textures/entity/zombie_crow.png`)
    })
    builder.onHurt(context => {
        // Log the amount of damage received by the entity
        // global.runOnHurt(context)
    })
    builder.aiStep(entity => {
        global.runZombieCrowTick(entity)
    })
    builder.createNavigation(context => EntityJSUtils.createFlyingPathNavigation(context.entity, context.level))
    builder.dropCustomDeathLoot(context => {
        context.entity.block.popItemFromFace('butchersdelight:dead_cow', 'up')
    })
    builder.addPartEntity("one", 1.2, 1.2, builder => {
        // Adds an additional hitbox to the entity with builder support
        builder
            .isPickable(true)
            .onPartHurt(context => {
                const { entity, part, source, amount } = context
                // Custom logic for determining how the parts of the entity should relay damage
                // To the entity. For example, relay double the damage to the entity when this hitbox is hit
                entity.attack(source, amount * 2)
                console.log("source: " + source + " amount: " + amount + " part name: " + part.name)
            })
    })
})

global.runZombieCrowTick = entity => {
    if (!(entity.level === 'ClientLevel')) {
        let nearestPlayer = null
        let nearestDistance = 999999
        entity.level.players.forEach(player => {
            let distance = entity.distanceToSqr(new Vec3d(player.x, player.y, player.z))
            if (distance < nearestDistance) { nearestDistance = distance; nearestPlayer = player }
        })
        // console.log(`nearest player ${nearestPlayer}`)
        if (!nearestPlayer) return
        let pointIndex = entity.getSyncedData("orbitalDestinationIndex")

        // mob checkpoint debug:
        for (let index = 0; index < 8; index++) {
            let angle = (index % 8) * (JavaMath.PI / 4)
            let targetX = nearestPlayer.x + Math.cos(angle) * ORBIT_RADIUS
            let targetY = entity.y
            let targetZ = nearestPlayer.z + Math.sin(angle) * ORBIT_RADIUS
            // console.log(`running loop ${targetX} ${targetY} ${targetZ}`)
            if (pointIndex === index) {
                entity.level.spawnParticles("minecraft:lava", false, targetX, targetY, targetZ, 0, 0, 0, 1, 0)

            } else {
                entity.level.spawnParticles("call_of_yucutan:rain_wisp", true, targetX, targetY, targetZ, 0, 0, 0, 1, 0)
            }
        }

        // actual movement logic:
        let angle = (pointIndex % 8) * (JavaMath.PI / 4)

        let targetX = nearestPlayer.x + Math.cos(angle) * ORBIT_RADIUS
        let targetY = entity.y
        let targetZ = nearestPlayer.z + Math.sin(angle) * ORBIT_RADIUS

        console.log(`moving to ${targetX} ${targetY} ${targetZ}`)
        entity.getNavigation().recomputePath()
        entity.getNavigation().moveTo(targetX, targetY, targetZ, 2)

        let entityX = entity.x
        let entityZ = entity.z

        if (entityX > targetX - 1 && entityX < targetX + 1 && entityZ > targetZ - 1 && entityZ < targetZ + 1) {
            console.log(`hit checkpoint`)
            if (pointIndex >= 7) {
                entity.setSyncedData("orbitalDestinationIndex", 0) // for some reason naming this correctly fucks it
            } else {
                entity.setSyncedData("orbitalDestinationIndex", pointIndex + 1)
            }
        }
    }

    entity.tickPart("one", entity.getLookAngle().x(), 0.8, entity.getLookAngle().z()) // can you just set this to look angle?
}

