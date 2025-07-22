// priority: 0

EntityEvents.hurt(event => {

    // Only proceed if a player was the source of damage
    console.info(`damage source: ${event.source}`)
    if (event.source.player) {
        let playerSource = event.source.player;

        playerSource.tell(`event.damage is now: ${event.damage}`);
    }
});