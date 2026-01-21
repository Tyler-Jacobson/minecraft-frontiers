
const BAIT_SPAWN_RADIUS = 5

function getRandomIntInclusive(min, max) { // replace with global
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; // The maximum is inclusive and the minimum is inclusive
}

StartupEvents.registry("block", event => {
    event.create("frontiers:deer_bait_block")
        .displayName("Deer Bait Block")
        .blockEntity(entityInfo => { // also has tick and serverTick methods
            entityInfo.tick(1, 0, entity => {
                let level = entity.level
                // console.log(`ticking bait block ${entity.age}`)
                // if (entity.age === 100) {
                //     let mobStartingPosition = new Vec3d(entity.x(), entity.y() + 1, entity.z())
                //     try {
                //         summonHuntableMobDeer(entity, entity.level, mobStartingPosition)

                //     } catch (err) {
                //         console.log(`failed to spawn deer ${err}`)
                //     }
                // }
            })
        })
        .placementState(placementEvent => {
            let level = placementEvent.level
            let pos = placementEvent.getClickLocation()
            let placedBlockLocation = placementEvent.block
            
            console.log(`placed block ${placementEvent.block.x} ${placementEvent.block.y} ${placementEvent.block.z}`)
            // console.log(`placed block ${Object.keys(placementEvent.getProperties())}`)
            console.log(`placed block ${Object.keys(placementEvent.block)}`)
            // console.log(`block placement state ${Object.keys(placementEvent)}`)
            if (!(level === 'ClientLevel')) {
                level.server.scheduleInTicks(20, () => {
                    try {
                        let randomAngleFromBait = getRandomIntInclusive(0, 360)
                        let angle = randomAngleFromBait * JavaMath.PI * 2 / 360
                        let locationX = pos.x() + 0.5 + Math.cos(angle) * BAIT_SPAWN_RADIUS
                        let locationZ = pos.z() + 0.5 + Math.sin(angle) * BAIT_SPAWN_RADIUS
                        let targetDestination = new Vec3d(locationX, pos.y(), locationZ)

                        let aboveGroundTargetDestination = global.adjustDestinationAboveGround(level, targetDestination)
                        console.log(`aboveGroundTargetDestination ${aboveGroundTargetDestination}`)
                        summonHuntableMobDeer(level, aboveGroundTargetDestination, placedBlockLocation)

                    } catch(err) {
                        console.log(`err spawning deer ${err}`)
                    }
                })
            }

            // if this works, can just do level.server.scheduleInTicks
        })
})

const summonHuntableMobDeer = (level, startingPosition, baitLocation) => {
    // const { level } = mob
    const huntableMob = level.createEntity("frontiers:huntable_deer_test");
    // it's crucial to set the huntableMob entity's owner here, since we're later going to reference this in order to get the damage source

    // huntableMob.setOwner(mob)
    // // const vel = lookAngle.scale(1)
    // // huntableMob.setMotion(vel.x(), vel.y(), vel.z())
    huntableMob.setPosition(startingPosition.x(), startingPosition.y() + 2, startingPosition.z())
    huntableMob.setNoGravity(false)
    huntableMob.setSyncedData('ownerBlockLocationX', baitLocation.x)
    huntableMob.setSyncedData('ownerBlockLocationY', baitLocation.y)
    huntableMob.setSyncedData('ownerBlockLocationZ', baitLocation.z)
    huntableMob.spawn()
}