BlockEvents.placed(event => {
    let placedBlock = event.getBlock()
    if (placedBlock.id == "frontiers:aura_block") global.auraBlockPositions.push([placedBlock.x, placedBlock.y, placedBlock.z])
})

LevelEvents.tick(event => {
    let level = event.level
    if (level.time % 10 != 0) return
    global.auraBlockPositions.forEach(pos => {
        for (let step = 0; step < 12; step++) {
            let angle = step * JavaMath.PI * 2 / 12
            let particleX = pos[0] + 0.5 + Math.cos(angle) * 0.6
            let particleZ = pos[2] + 0.5 + Math.sin(angle) * 0.6
            // level.spawnParticles("minecraft:smoke", true, particleX, pos[1] + 0.2, particleZ, 0, 0, 0, 1, 0)
            console.log(`spawning particles at ${particleX} ${pos[1] + 0.2} ${particleZ}`)
            event.server.scheduleInTicks(step, () => {
                level.spawnParticles("minecraft:smoke", true, particleX, pos[1] + 0.2, particleZ, 0, 0, 0, 1, 0)
            })
        }
    })
})