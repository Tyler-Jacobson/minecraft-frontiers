// server_scripts/bosses/boss_kraken/boss_ai_ghast_native.js
//
// Kraken AI: "native Ghast" style.
// We explicitly install the same goals a Ghast uses in initGoals(),
// using vanilla Java classes + EntityJS arbitraryGoal helpers.

const MOVE_SPEED = 0.01;

const BOSS_ID = 'frontiers:custom_kraken'


// EntityEvents.hurt('frontiers:custom_kraken', event => {
//   event.entity.triggerAnimation('krakenBossController', 'kraken_idle')
// })

EntityJSEvents.addGoalSelectors(BOSS_ID, event => {

    const $RandomFloatAroundGoal = Java.loadClass('net.minecraft.world.entity.monster.Ghast$RandomFloatAroundGoal')
    const $GhastLookGoal = Java.loadClass('net.minecraft.world.entity.monster.Ghast$GhastLookGoal')
    const $GhastShootFireballGoal = Java.loadClass('net.minecraft.world.entity.monster.Ghast$GhastShootFireballGoal')

    // event.arbitraryGoal(
    //     7,
    //     /** @param {Internal.GhastEntityJS} entity */
    //     entity => new $RandomFloatAroundGoal(entity)
    // )

    // event.arbitraryGoal(
    //     1,
    //     /** @param {Internal.GhastEntityJS} entity */
    //     entity => new $GhastLookGoal(entity)
    // )

    event.customGoal(
        'look_nearest_player',
        1,
        mob => true,
        mob => true,
        true,
        mob => { },
        mob => { },
        true,
        mob => {
            let nearbyEntities = mob.level.getEntitiesWithin(mob.boundingBox.inflate(1000))
            let nearbyPlayers = nearbyEntities.filter(candidate => candidate.isPlayer())
            // console.log(`nearby players ${nearbyPlayers}`)
            if (nearbyPlayers.length === 0) return
            nearbyPlayers.sort((firstPlayer, secondPlayer) => firstPlayer.distanceToEntity(mob) - secondPlayer.distanceToEntity(mob))

            const moveTo = new Vec3d((mob.x - 0.01) * MOVE_SPEED, ((mob.y - 0.01) + 30) * MOVE_SPEED, (mob.z - 0.01) * MOVE_SPEED)

            mob.setDeltaMovement(moveTo);

            // let targetPlayer = nearbyPlayers[0]
            // mob.lookAt(targetPlayer, 30, 30) // working
            
            let currentRotation = mob.getSyncedData('Rotation') || 0
            mob.setRotation(currentRotation, 50)


            mob.setSyncedData('Rotation', currentRotation + 1)
            console.log(`currentRotation ${currentRotation}`)

        }
    )
    // event.arbitraryGoal(
    //     3,
    //     /** @param {Internal.GhastEntityJS} entity */
    //     entity => new $GhastShootFireballGoal(entity)
    // )
    event.customGoal(
        'maintain_distance',
        2,
        mob => true,
        mob => true,
        true,
        mob => {
            let $MoveGoalFlag = Java.loadClass("net.minecraft.world.entity.ai.goal.Goal$Flag")
            let EnumSet = Java.loadClass("java.util.EnumSet")
            let currentGoal = mob.goalSelector.getAvailableGoals().find(selector => selector.getGoal().toString() === 'CustomGoal[maintain_distance]')
            console.log(`currentGoal ${$MoveGoalFlag.MOVE}`)

            currentGoal.setFlags(EnumSet.of($MoveGoalFlag.MOVE))
        },
        mob => mob.getNavigation().stop(),
        true,
        /** @param {Internal.GhastEntityJS} mob */ mob => {
            const entity = mob.level.getNearestPlayer(mob, 500)
            if (entity == null) return
            const moveTo = new Vec3d((entity.x - mob.getX()) * MOVE_SPEED, ((entity.y - mob.getY()) + 30) * MOVE_SPEED, (entity.z - mob.getZ()) * MOVE_SPEED)
            const moveAway = new Vec3d((mob.getX() - entity.x) * MOVE_SPEED, ((mob.getY() - (entity.y)) + 30) * MOVE_SPEED, (mob.getZ() - entity.z) * MOVE_SPEED)
            if (entity.distanceToEntity(mob) > 30) {
                mob.setDeltaMovement(moveTo);
            }
            if (entity.player && entity.distanceToEntity(mob) < 20) {
                mob.setDeltaMovement(moveAway);
            }
            // console.log(`ticking maintain distance`)
            // mob.setSyncedData('Idle', true)
        }
    )
    // const COOLDOWN_TICKS = 100, SPAWN_OFFSET = 2.5; let spawnCooldown = 0;
    // event.customGoal('spawn_near_player', 9, mob => true, mob => true, true, mob => { }, mob => { }, true, mob => {
    //     // console.log(`ticking spawn_near_player`)
    //     if (spawnCooldown > 0) { spawnCooldown--; } else {
    //         let nearestPlayer = mob.level.getNearestPlayer(mob, 64); if (nearestPlayer) {
    //             let spawnX = nearestPlayer.x + (Math.random() * 2 - 1) * SPAWN_OFFSET, spawnY = nearestPlayer.y, spawnZ = nearestPlayer.z + (Math.random() * 2 - 1) * SPAWN_OFFSET;
    //             let zombieEntity = mob.level.createEntity('minecraft:zombie'); zombieEntity.setPos(spawnX, spawnY, spawnZ); zombieEntity.spawn();
    //             // mob.level.addParticle('minecraft:portal', spawnX, spawnY + 1, spawnZ, 0, 0, 0);
    //             mob.level.spawnParticles("minecraft:smoke", false, spawnX, spawnY, spawnZ, 0, 0, 0, 100, 0.1)
    //         }
    //         spawnCooldown = COOLDOWN_TICKS;
    //         mob.setSyncedData('Idle', !mob.getSyncedData('Idle'))

    //     }
    //     let targetPlayer = mob.level.getNearestPlayer(mob, 128); if (!targetPlayer) return;
    //     mob.level.getEntitiesWithin(mob.boundingBox.inflate(32)).forEach(candidate => {
    //         if (String(candidate.type) === 'minecraft:zombie') candidate.setTarget(targetPlayer);
    //     });
    // });
})

// ---------------------------------------------------------------------------
// Target goals – replicate vanilla Ghast target behavior
// ---------------------------------------------------------------------------

EntityJSEvents.addGoals(BOSS_ID, event => {
    const Player = Java.loadClass('net.minecraft.world.entity.player.Player')

    // 1: Nearest attackable player (Ghast-style)
    //    This roughly matches vanilla: "find player, must see, etc."
    let nearestAttackableTarget = event.nearestAttackableTarget(
        1,
        Player,
        200,   // detection radius
        false, // mustSee
        false, // mustReach (mostly irrelevant for flying, but fine)
        player => !player.creative && !player.spectator
    )

    // console.log(`nearestAttackableTarget ${nearestAttackableTarget}`)

    // this does nothing for creatures without a melee attack. Keeping it here for future reference
    event.hurtByTarget(
        2,
        [],    // excluded classes (none)
        true,  // alertAllies
        []     // ignored classes (none)
    )
})

