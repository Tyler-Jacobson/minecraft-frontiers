let BlockPathTypes = Java.loadClass("net.minecraft.world.level.pathfinder.BlockPathTypes")



global.runDampedSwim = entity => {
    if (entity.isInWater()) {
        let currentX = entity.getDeltaMovement().x()
        let currentZ = entity.getDeltaMovement().z()
        entity.setDeltaMovement(new Vec3d(currentX, 0.05, currentZ))
    }
}

global.runNavigateToBait = entity => {
    try {
        if (!(entity.level === 'ClientLevel')) {
            let targetX = entity.getSyncedData('ownerBlockLocationX')
            let targetY = entity.getSyncedData('ownerBlockLocationY')
            let targetZ = entity.getSyncedData('ownerBlockLocationZ')
            if (entity.isInWater()) { // now that amphib nav is working, is this necessary?
                try {
                    // water nav
                    entity.getLookControl().setLookAt(targetX, targetY, targetZ)
                    entity.getNavigation().moveTo(targetX, targetY, targetZ, 10)
                } catch (err) {
                    console.log(`error setting pathfinding malice ${err}`)
                }
            } else {
                // ground navigation
                entity.getNavigation().moveTo(targetX, targetY, targetZ, 0.5)
            }
        }


    } catch (err) {
        console.log(`failed to runNavigateToBait ${err}`)
    }
}

global.runUnstuckPanic = entity => {
    let randomPos = DefaultRandomPos.getPos(entity, 5, 10);
    if (randomPos && entity.getNavigation().isDone()) {
        entity.getNavigation().moveTo(randomPos.x(), randomPos.y(), randomPos.z(), 1)
        console.log(`running unstuck panic navigation`)
    }
}

global.startDespawn = entity => {
    // entity.kill()

    // entity.remove('DISCARDED')
    let uuid = entity.uuid
    let level = entity.level

    Utils.server.scheduleInTicks(20, () => {
        global.runDespawn(uuid, level)
    })
}

global.runDespawn = (uuid, level) => {
    let entity = level.getEntity(uuid)
    if (entity && entity.isAlive()) {
        entity.remove('DISCARDED')

    }
}