const KRAKEN_MOVESPEED = 5
const KRAKEN_MOVEMENT_DESTINATION_Y_OFFSET = 5

const runIdle = (entity) => {
    let actionDuration = 100 // how long will the action take (in ticks)
    entity.persistentData.startNextActionAge = entity.age + actionDuration // set persistent data to run new action after this one finishes
    entity.persistentData.putBoolean('lastActionWasIdle', true) // set persistent data to know that our last action was 'idle'
    entity.triggerAnimation('krakenBossController', 'k_idle') // play animations
    entity.persistentData.actionQueue = [] // clear the action queue
    // movement function here
    summonMinions(entity)
    moveToLocation(entity)
}

const moveToLocation = (entity) => {
    let targetPlayer = getPriorityTarget(entity)

    let distanceFromTargetPlayer = 20
    let yOffsetFromTargetPlayer = 1
    let randomMovementAngle = getRandomIntInclusive(0, 360)

    let targetDestination = mobRelativeLocation(targetPlayer, distanceFromTargetPlayer, randomMovementAngle, yOffsetFromTargetPlayer)
    let aboveGroundTargetDestination = global.adjustDestinationAboveGround(entity.level, targetDestination)
    let targetPlusYOffset = new Vec3d(aboveGroundTargetDestination.x(), aboveGroundTargetDestination.y() + KRAKEN_MOVEMENT_DESTINATION_Y_OFFSET, aboveGroundTargetDestination.z())
    let destinationAngle = global.angleVecFromAToB(entity.getEyePosition(), targetPlusYOffset)
    const vel = destinationAngle.scale(KRAKEN_MOVESPEED)
    entity.setMotion(vel.x(), vel.y(), vel.z())

}

const summonMinions = (entity) => {
    let nearbyPlayers = getNearbyPlayers(entity, 200)
    nearbyPlayers.forEach((targetPlayer) => {
        let distanceFromTargetPlayer = 10
        let yOffsetFromTargetPlayer = 1
        let randomAngleFromPlayer = getRandomIntInclusive(0, 360)
        let targetDestination = mobRelativeLocation(targetPlayer, distanceFromTargetPlayer, randomAngleFromPlayer, yOffsetFromTargetPlayer)
        let aboveGroundTargetDestination = global.adjustDestinationAboveGround(entity.level, targetDestination)
        let minionEntity = entity.level.createEntity('block_factorys_bosses:soul_skeleton');
        minionEntity.setPos(aboveGroundTargetDestination.x(), aboveGroundTargetDestination.y(), aboveGroundTargetDestination.z());
        minionEntity.spawn();
        minionEntity.setTarget(targetPlayer);
    })
}