// global.anvilMenuRef = 'something'

const getPlayerSpecificData = (player, key) => {
    let playerStringUUID = `${player.getStringUuid()}`

    let playerData = global.globalPlayerDataMap.get(playerStringUUID)
    return playerData[key]
}

const setPlayerSpecificData = (player, key, value) => {
    try {
        let playerStringUUID = `${player.getStringUuid()}`
        let playerData = global.globalPlayerDataMap.get(playerStringUUID) ?? {}

        playerData[key] = value
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