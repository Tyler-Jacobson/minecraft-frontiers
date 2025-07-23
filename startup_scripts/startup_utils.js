const getRandomSound = (soundsArray, threeMostRecentSoundSelections) => {
    // console.info(`threeMostRecentSoundSelections ${threeMostRecentSoundSelections}`)

    const filteredSoundsArray = soundsArray.filter((sound) => {
        return !threeMostRecentSoundSelections.includes(sound)
    })

    let min = 0;
    let max = filteredSoundsArray.length - 1;
    // console.info(`filteredSoundsArray.length ${filteredSoundsArray.length}`)
    let randomSoundIndex = Math.floor(Math.random() * (max - min + 1)) + min;
    const newSoundSelection = filteredSoundsArray[randomSoundIndex]
    // console.info(`newSoundSelection infunction ${newSoundSelection}`)
    threeMostRecentSoundSelections.unshift(newSoundSelection)
    if (threeMostRecentSoundSelections.length > 3) {
        threeMostRecentSoundSelections.pop()
    }
    return newSoundSelection
}

const getPlayerSpecificData = (player, key) => {
    let playerStringUUID = `${player.getStringUuid()}`
    let keyString = `${key}`

    let playerData = global.globalPlayerDataMap.get(playerStringUUID)
    return playerData[keyString]
}