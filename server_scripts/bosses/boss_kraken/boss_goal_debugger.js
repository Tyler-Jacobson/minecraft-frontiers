
ServerEvents.tick(event => {
  const { server } = event;

  // 🔧 Adjust this if you really want *every* tick.
  // This is "once per second" (20 ticks) to keep logs sane.
  if (server.tickCount % 20 !== 0) return;

  // Find all kraken in all loaded dimensions
  server.entities
    .filterSelector('@e[type=frontiers:custom_kraken]')
    .forEach(kraken => {
      // Kraken are mobs, so they have a goalSelector
      const mob = /** @type {Internal.Mob} */ (kraken);

      // getRunningGoals() -> Stream<WrappedGoal>
      mob.goalSelector
        .getRunningGoals()
        .forEach(wrapped => {
          const goal = wrapped.goal;            // bean for getGoal()
          const priority = wrapped.priority;    // bean for getPriority()
          const running = wrapped.running;      // bean for isRunning()

          console.log(
            `[Kraken AI] @ ${mob.blockX},${mob.blockY},${mob.blockZ} ` +
            `priority=${priority}, running=${running}, goal=${goal.class.name}`
          );
        });
    });
});