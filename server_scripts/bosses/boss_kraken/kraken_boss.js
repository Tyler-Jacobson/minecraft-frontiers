// server_scripts/bosses/boss_kraken/boss_ghast_ai.js
//
// "Black box" Kraken AI tuning:
// - Let vanilla Ghast AI run (via builder.defaultGoals(true)).
// - Optionally tweak target behavior & future boss-specific goals.
//
// ⚠ IMPORTANT:
// Delete or disable any older boss_ai.js that re-implemented hover/orbit/fireball,
// otherwise you’ll have two competing AI stacks.

const BOSS_ID = 'frontiers:custom_kraken'

// ---------------------------------------------------------------------------
// Goal selectors – movement/behavior goals
// For the Ghast-based Kraken, we *mostly* leave these alone.
// Ghast.registerGoals() already gave us:
//   - Random flying / hovering
//   - Look-at-player behavior
//   - Fireball shooting logic
//
// You’ll add custom boss goals here later (phase mechanics, minion spawns, etc.).
// ---------------------------------------------------------------------------

EntityJSEvents.addGoalSelectors(BOSS_ID, e => {
  // Example placeholder for future boss-only goals:
  //
  // e.customGoal(
  //   'phase_roar',
  //   5,
  //   mob => mob.tags.contains('phase3'),  // canUse
  //   mob => mob.tags.contains('phase3'),  // canContinue
  //   true,
  //   mob => { /* start roar */ },
  //   mob => { /* stop roar  */ },
  //   false,
  //   mob => { /* per-tick behavior if needed */ }
  // )
  //
  // For now, we simply rely on vanilla Ghast movement + fireball goals.
})

// ---------------------------------------------------------------------------
// Target goals – who the boss actually attacks
//
// Ghast already has a `NearestAttackableTargetGoal<Player>` by default.
// Here we show how to *replace* it with a version that:
//   - Has a larger detection radius
//   - Explicitly ignores creative & spectator players
// ---------------------------------------------------------------------------

EntityJSEvents.addGoals(BOSS_ID, event => {
  let Player = Java.loadClass('net.minecraft.world.entity.player.Player')
  let $NearestAttackableTargetGoal =
    Java.loadClass('net.minecraft.world.entity.ai.goal.target.NearestAttackableTargetGoal')

  // Remove any existing NearestAttackableTargetGoal instances
  // that Ghast.registerGoals() added. We match by exact class.
  event.removeGoals(context => {
    let goal = context.goal
    return goal.getClass() == $NearestAttackableTargetGoal
  })

  // Add our own player-targeting goal with clear conditions.
  event.nearestAttackableTarget(
    1,          // priority
    Player,     // target class
    64,         // range (blocks)
    true,       // mustSee
    true,       // mustReach
    player => {
      // Extra predicate: only target survival/adventure players
      return !player.creative && !player.spectator
    }
  )

  // We leave HurtByTarget and any other Ghast target goals alone
  // so it still retaliates naturally.
})