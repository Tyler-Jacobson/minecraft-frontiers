// server_scripts/bosses/boss_kraken/boss_ai_ghast_native.js
//
// Kraken AI: "native Ghast" style.
// We explicitly install the same goals a Ghast uses in initGoals(),
// using vanilla Java classes + EntityJS arbitraryGoal helpers.

const MOVE_SPEED = 0.01;

const BOSS_ID = 'frontiers:custom_kraken'

EntityJSEvents.addGoalSelectors(BOSS_ID, event => {

    const $RandomFloatAroundGoal = Java.loadClass('net.minecraft.world.entity.monster.Ghast$RandomFloatAroundGoal')
    const $GhastLookGoal = Java.loadClass('net.minecraft.world.entity.monster.Ghast$GhastLookGoal')
    const $GhastShootFireballGoal = Java.loadClass('net.minecraft.world.entity.monster.Ghast$GhastShootFireballGoal')

    // event.arbitraryGoal(
    //     7,
    //     /** @param {Internal.GhastEntityJS} entity */
    //     entity => new $RandomFloatAroundGoal(entity)
    // )

    event.arbitraryGoal(
        8,
        /** @param {Internal.GhastEntityJS} entity */
        entity => new $GhastLookGoal(entity)
    )

    event.arbitraryGoal(
        2,
        /** @param {Internal.GhastEntityJS} entity */
        entity => new $GhastShootFireballGoal(entity)
    )
    event.customGoal(
        'maintain_distance',
        1,
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
            const entity = mob.level.getNearestPlayer(mob, 50)
            if (entity == null) return
            const moveTo = new Vec3d((entity.x - mob.getX()) * MOVE_SPEED, (entity.y - mob.getY()) * MOVE_SPEED, (entity.z - mob.getZ()) * MOVE_SPEED)
            const moveAway = new Vec3d((mob.getX() - entity.x) * MOVE_SPEED, (mob.getY() - entity.y) * MOVE_SPEED, (mob.getZ() - entity.z) * MOVE_SPEED)
            if (entity.distanceToEntity(mob) > 30) {
                mob.setDeltaMovement(moveTo);
            }
            if (entity.player && entity.distanceToEntity(mob) < 20) {
                mob.setDeltaMovement(moveAway);
            }

        }
    )
    const COOLDOWN_TICKS = 100, SPAWN_OFFSET = 2.5; let spawnCooldown = 0;
    event.customGoal('spawn_near_player', 1, mob => true, mob => true, true, mob => { }, mob => { }, true, mob => {
        if (spawnCooldown > 0) { spawnCooldown--; } else {
            let nearestPlayer = mob.level.getNearestPlayer(mob, 64); if (nearestPlayer) {
                let spawnX = nearestPlayer.x + (Math.random() * 2 - 1) * SPAWN_OFFSET, spawnY = nearestPlayer.y, spawnZ = nearestPlayer.z + (Math.random() * 2 - 1) * SPAWN_OFFSET;
                let zombieEntity = mob.level.createEntity('minecraft:zombie'); zombieEntity.setPos(spawnX, spawnY, spawnZ); zombieEntity.spawn();
                // mob.level.addParticle('minecraft:portal', spawnX, spawnY + 1, spawnZ, 0, 0, 0);
                mob.level.spawnParticles("minecraft:smoke", false, spawnX, spawnY, spawnZ, 0, 0, 0, 100, 0.1)
            }
            spawnCooldown = COOLDOWN_TICKS;
        }
        let targetPlayer = mob.level.getNearestPlayer(mob, 128); if (!targetPlayer) return;
        mob.level.getEntitiesWithin(mob.boundingBox.inflate(32)).forEach(candidate => {
            if (String(candidate.type) === 'minecraft:zombie') candidate.setTarget(targetPlayer);
        });
    });
})

// ---------------------------------------------------------------------------
// Target goals – replicate vanilla Ghast target behavior
// ---------------------------------------------------------------------------

EntityJSEvents.addGoals(BOSS_ID, event => {
    const Player = Java.loadClass('net.minecraft.world.entity.player.Player')

    // 1: Nearest attackable player (Ghast-style)
    //    This roughly matches vanilla: "find player, must see, etc."
    event.nearestAttackableTarget(
        1,
        Player,
        200,   // detection radius
        true, // mustSee
        true, // mustReach (mostly irrelevant for flying, but fine)
        player => !player.creative && !player.spectator
    )

    // this does nothing for creatures without a melee attack. Keeping it here for future reference
    event.hurtByTarget(
        2,
        [],    // excluded classes (none)
        true,  // alertAllies
        []     // ignored classes (none)
    )
})
