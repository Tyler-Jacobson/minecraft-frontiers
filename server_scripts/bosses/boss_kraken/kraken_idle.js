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

function adjustDestinationAboveGround(level, targetDestination) {
    console.log(`x ${targetDestination.x()}`)
  let blockX = Math.floor(targetDestination.x())
  let blockY = Math.floor(targetDestination.y())
  let blockZ = Math.floor(targetDestination.z())
  while (level.getBlock(blockX, blockY + 1, blockZ).id != "minecraft:air") blockY++
  return new Vec3d(targetDestination.x(), blockY + 5, targetDestination.z())
}

const moveToLocation = (entity) => {
    let targetPlayer = getPriorityTarget(entity)

    let distanceFromTargetPlayer = 20
    let yOffsetFromTargetPlayer = 1
    let randomMovementAngle = getRandomIntInclusive(0, 360)

    let targetDestination = mobRelativeLocation(targetPlayer, distanceFromTargetPlayer, randomMovementAngle, yOffsetFromTargetPlayer)
    let aboveGroundTargetDestination = adjustDestinationAboveGround(entity.level, targetDestination)
    let destinationAngle = global.angleVecFromAToB(entity.getEyePosition(), aboveGroundTargetDestination)
    const vel = destinationAngle.scale(KRAKEN_MOVESPEED)
    entity.setMotion(vel.x(), vel.y(), vel.z())

}