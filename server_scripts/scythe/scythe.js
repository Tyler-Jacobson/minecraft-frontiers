ItemEvents.firstLeftClicked("frontiers:custom_scythe", event => {
    console.info('first left clicked')
})

NetworkEvents.dataReceived('better_combat_scythe_attack_started', (event) => { // this runs on server side once when left clicking with the scythe
    // this is all I needed. This code will run on scythe left click
    console.info(`event data received ${event.data}`)
    console.info(`event entity ${event.entity}`)
});