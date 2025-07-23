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
    return playerData[keyString]
}

global.setPlayerSpecificData = (player, key, value) => {
    try {
        let playerStringUUID = `${player.getStringUuid()}`
        let keyString = `${key}`
        let playerData = global.globalPlayerDataMap.get(playerStringUUID) ?? {}

        playerData[keyString] = value
        global.globalPlayerDataMap.set(playerStringUUID, playerData)
    } catch (err) {
        console.error(`setPlayerSpecificData error: ${err}`)
    }
}