// global.anvilMenuRef = 'something'

const getPlayerSpecificData = (player, key) => {
    let playerStringUUID = `${player.getStringUuid()}`
    let keyString = `${key}`

    let playerData = global.globalPlayerDataMap.get(playerStringUUID)
    return playerData[keyString]
}

const setPlayerSpecificData = (player, key, value) => {
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




PlayerEvents.inventoryOpened('anvil', (event) => {
    const player = event.getPlayer()
    setPlayerSpecificData(player, 'anvilMenuRef', event)
    // global.anvilMenuRef = event
})