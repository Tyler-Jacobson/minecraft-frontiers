// server_scripts/bosses/boss_kraken/boss_ai_ghast_native.js
//
// Kraken AI: "native Ghast" style.
// We explicitly install the same goals a Ghast uses in initGoals(),
// using vanilla Java classes + EntityJS arbitraryGoal helpers.

const BOSS_ID = 'frontiers:custom_kraken'

EntityJSEvents.addGoalSelectors(BOSS_ID, event => {

    const $RandomFloatAroundGoal = Java.loadClass('net.minecraft.world.entity.monster.Ghast$RandomFloatAroundGoal')
    const $GhastLookGoal = Java.loadClass('net.minecraft.world.entity.monster.Ghast$GhastLookGoal')
    const $GhastShootFireballGoal = Java.loadClass('net.minecraft.world.entity.monster.Ghast$GhastShootFireballGoal')

    event.arbitraryGoal(
        7,
        /** @param {Internal.GhastEntityJS} entity */
        entity => new $RandomFloatAroundGoal(entity)
    )

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