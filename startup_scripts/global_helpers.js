const getRandomSound = (soundsArray, threeMostRecentSoundSelections) => {

    const filteredSoundsArray = soundsArray.filter((sound) => {
        return !threeMostRecentSoundSelections.includes(sound)
    })

    let min = 0;
    let max = filteredSoundsArray.length - 1;
    let randomSoundIndex = Math.floor(Math.random() * (max - min + 1)) + min;
    const newSoundSelection = filteredSoundsArray[randomSoundIndex]
    threeMostRecentSoundSelections.unshift(newSoundSelection)
    if (threeMostRecentSoundSelections.length > 3) {
        threeMostRecentSoundSelections.pop()
    }
    return newSoundSelection
}

global.getPlayerSpecificData = (player, key) => {
    let playerStringUUID = `${player.getStringUuid()}`
    let keyString = `${key}`

    let playerData = global.globalPlayerDataMap.get(playerStringUUID)
    if (playerData) {
        return playerData[keyString]
    }
    return null
}

global.setPlayerSpecificData = (player, key, value) => {
    try {
        let playerStringUUID = `${player.getStringUuid()}`
        let keyString = `${key}`
        let playerData = global.globalPlayerDataMap.get(playerStringUUID) ?? {}

        playerData[keyString] = value
        console.info(`set playerData[keyString] = value to: ${playerData[keyString]} = ${value}`)
        console.info(`set playerData for player ${playerStringUUID} to ${Object.keys(playerData)}`)
        global.globalPlayerDataMap.set(playerStringUUID, playerData)
    } catch (err) {
        console.error(`setPlayerSpecificData error: ${err}`)
    }
}

// calculates the trajectory of projectiles from point a to b. Both args are Vec3d
global.angleVecFromAToB = (positionA, positionB) => {
    let deltaX = positionB.x() - positionA.x()
    let deltaY = positionB.y() - positionA.y()
    let deltaZ = positionB.z() - positionA.z()
    let length = Math.sqrt(deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ)
    let directionX = deltaX / length
    let directionY = deltaY / length
    let directionZ = deltaZ / length
    return new Vec3d(directionX, directionY, directionZ)
}

global.adjustDestinationAboveGround = (level, targetDestination) => {
    let blockX = Math.floor(targetDestination.x())
    let blockY = Math.floor(targetDestination.y())
    let blockZ = Math.floor(targetDestination.z())
    while (level.getBlock(blockX, blockY + 1, blockZ).id != "minecraft:air" &&
        level.getBlock(blockX, blockY + 1, blockZ).id != "minecraft:chorus_plant") {
        // console.log(`while loop: ${level.getBlock(blockX, blockY + 1, blockZ).id}`)
        blockY++
    }
    return new Vec3d(targetDestination.x(), blockY, targetDestination.z())
}