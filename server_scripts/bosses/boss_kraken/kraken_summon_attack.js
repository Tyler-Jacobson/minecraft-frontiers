const SUMMON_MINION_COUNT = 4

const runSummon = (entity, event) => {
    // console.log('running summon')
    let actionDuration = 400
    entity.persistentData.startNextSummonActionAge = entity.age + actionDuration
    let uuid = entity.uuid

    event.server.scheduleInTicks(1, () => {
        runSummonAttack(uuid, event)
    })
}

const runSummonAttack = (uuid, event) => {
    let entity = event.level.getEntity(uuid)
    if (entity && entity.isAlive()) {
        multiSummonMinions(entity, SUMMON_MINION_COUNT)
    }
}

const multiSummonMinions = (entity, summonMinionCount) => {
    let nearbyPlayers = getNearbyPlayers(entity, 200)
    nearbyPlayers.forEach((targetPlayer) => {
        let distanceFromTargetPlayer = 10
        let yOffsetFromTargetPlayer = 1
        for (let i = 0; i < summonMinionCount; i++) {
            let randomAngleFromPlayer = getRandomIntInclusive(0, 360)
            let targetDestination = mobRelativeLocation(targetPlayer, distanceFromTargetPlayer, randomAngleFromPlayer, yOffsetFromTargetPlayer)
            let aboveGroundTargetDestination = global.adjustDestinationAboveGround(entity.level, targetDestination)
            let minionEntity = entity.level.createEntity('block_factorys_bosses:soul_skeleton');
            minionEntity.setPos(aboveGroundTargetDestination.x(), aboveGroundTargetDestination.y(), aboveGroundTargetDestination.z());
            minionEntity.persistentData.putBoolean('isKrakenSummon', true)
            minionEntity.potionEffects.add("minecraft:speed", 200, 1, false, true)
            minionEntity.spawn();
            minionEntity.setTarget(targetPlayer);
        }
    })
}