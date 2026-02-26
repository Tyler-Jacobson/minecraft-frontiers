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
    let getVectorComponent = (vector, componentName) => {
        if (!vector) {
            return null
        }
        let componentMethod = vector[componentName]
        if (typeof componentMethod === 'function') {
            return Number(componentMethod.call(vector))
        }
        let componentValue = vector[componentName]
        if (Number.isFinite(componentValue)) {
            return Number(componentValue)
        }
        return null
    }

    let positionAX = getVectorComponent(positionA, 'x')
    let positionAY = getVectorComponent(positionA, 'y')
    let positionAZ = getVectorComponent(positionA, 'z')
    let positionBX = getVectorComponent(positionB, 'x')
    let positionBY = getVectorComponent(positionB, 'y')
    let positionBZ = getVectorComponent(positionB, 'z')

    if (
        !Number.isFinite(positionAX) ||
        !Number.isFinite(positionAY) ||
        !Number.isFinite(positionAZ) ||
        !Number.isFinite(positionBX) ||
        !Number.isFinite(positionBY) ||
        !Number.isFinite(positionBZ)
    ) {
        console.error(`angleVecFromAToB invalid args positionA=${positionA} positionB=${positionB}`)
        return new Vec3d(0, 0, 0)
    }

    let deltaX = positionBX - positionAX
    let deltaY = positionBY - positionAY
    let deltaZ = positionBZ - positionAZ
    let length = Math.sqrt(deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ)
    if (length === 0) {
        return new Vec3d(0, 0, 0)
    }
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