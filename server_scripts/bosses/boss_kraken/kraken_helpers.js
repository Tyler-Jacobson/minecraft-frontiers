const randomActionSelector = (entity) => {
    if (!entity.persistentData.getBoolean('lastActionWasIdle')) {
        return 'idle'
    }
    // randomizer here when more attacks are added
    return 'red'
}

// calculates a position relative to the current position and rotation of a mob / boss / player. Usually for spawning attack entities
// first arg is the mob, second is distance in blocks away from the mob's eye position, last is the number of degrees of rotation around the mob to spawn the attack
const mobRelativeLocation = (mob, distance, angleDegrees) => {
    try {
        let lookDirection = mob.getLookAngle()
        let radians = angleDegrees * JavaMath.PI / 180
        let cosAngle = Math.cos(radians)
        let sinAngle = Math.sin(radians)
        let directionX = lookDirection.x() * cosAngle - lookDirection.z() * sinAngle
        let directionZ = lookDirection.x() * sinAngle + lookDirection.z() * cosAngle
        let directionY = lookDirection.y()
        let targetX = mob.x + directionX * distance
        let targetY = mob.y + directionY * distance
        let targetZ = mob.z + directionZ * distance
        return new Vec3d(targetX, targetY, targetZ)
    } catch (err) {
        console.error(`mobRelativeLocation ${err}`)
    }
}

// calculates the trajectory of projectiles from point a to b. Both args are Vec3d
const angleVecFromAToB = (positionA, positionB) => {
    let deltaX = positionB.x() - positionA.x()
    let deltaY = positionB.y() - positionA.y()
    let deltaZ = positionB.z() - positionA.z()
    let length = Math.sqrt(deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ)
    let directionX = deltaX / length
    let directionY = deltaY / length
    let directionZ = deltaZ / length
    return new Vec3d(directionX, directionY, directionZ)
}

const getRandomIntInclusive = (min, max) => {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  // The maximum is inclusive and the minimum is inclusive
  return Math.floor(Math.random() * (maxFloored - minCeiled + 1)) + minCeiled;
}