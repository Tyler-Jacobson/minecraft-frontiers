const KRAKEN_MOVESPEED = 5

const runIdle = (entity) => {
    let actionDuration = 100 // how long will the action take (in ticks)
    entity.persistentData.startNextActionAge = entity.age + actionDuration // set persistent data to run new action after this one finishes
    entity.persistentData.putBoolean('lastActionWasIdle', true) // set persistent data to know that our last action was 'idle'
    entity.triggerAnimation('krakenBossController', 'k_idle') // play animations
    entity.persistentData.actionQueue = [] // clear the action queue
    // movement function here
    moveToLocation(entity)
}

const moveToLocation = (entity) => {
    let targetPlayer = getPriorityTarget(entity)
    let currentMovement = entity.getDeltaMovement()

    let distanceFromTargetPlayer = 20
    let yOffsetFromTargetPlayer = 5
    let randomMovementAngle = getRandomIntInclusive(0, 360)

    let targetDestination = mobRelativeLocation(targetPlayer, distanceFromTargetPlayer, randomMovementAngle, yOffsetFromTargetPlayer)
    let destinationAngle = angleVecFromAToB(entity.getEyePosition(), targetDestination)
    const vel = destinationAngle.scale(KRAKEN_MOVESPEED)
    entity.setMotion(vel.x(), vel.y(), vel.z())
    // entity.setDeltaMovement(targetPlayer.getEyePosition())
    // entity.setMotion(currentMovement.x(), currentMovement.y(), currentMovement.z())
    // entity.setDeltaMovement(currentMovement)

}