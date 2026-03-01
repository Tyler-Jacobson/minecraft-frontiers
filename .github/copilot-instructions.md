# Copilot Workspace Instructions

## Workspace version context (authoritative)

Treat this repository as targeting **Minecraft 1.20.1** with **KubeJS for 1.20.1**.

- Assume all script/API recommendations must be compatible with the 1.20.1 generation of KubeJS.
- If there is version ambiguity, prefer 1.20.1-compatible syntax and behavior.
- Installed mod context for this instance: `kubejs-forge-2001.6.5-build.16` (MC 1.20.1).

## KubeJS support knowledge base

For KubeJS questions in this workspace, always consult the local support KB first:

- `docs/kubejs-kb/tickets.index.jsonl`
- `docs/kubejs-kb/README.md`

### Required behavior

1. Prioritize patterns and solutions from these local tickets before using general knowledge.
2. Prefer answers that match the workspace version context (`support-1․16-1․20` export).
3. If uncertain, call out uncertainty and suggest a minimal, testable script.
4. When useful, mention 1-3 related ticket titles from the KB as precedents.
5. Keep recommendations compatible with existing script style in this workspace.

### Retrieval guidance

- Use semantic/file search over `docs/kubejs-kb/tickets.index.jsonl` for relevant tags and excerpts.
- Match by topic tags (`recipes`, `items`, `events`, `textures_models`, `errors`, etc.) and keywords.
- Favor tickets with `has_support_answer: true`.

## KubeJS scripting guardrails (must follow)

These are hard rules for this workspace and override generic assumptions:

1. **Math constants**
	- Do not use `Math.PI` in KubeJS scripts in this workspace.
	- Use `JavaMath.PI` instead.

2. **Always use full namespace IDs**
	- Do not rely on shorthand IDs in registrations (for example, `event.create('aura_block')`).
	- Always use fully-qualified IDs (for example, `event.create('kubejs:aura_block')`).

3. **Variable naming quality**
	- Use descriptive variable names.
	- Avoid one-letter and two-letter variable names except in trivial callback signatures where no clearer alternative exists.

4. **Block ticking pattern**
	- When a custom block needs ticking behavior, prefer block-entity ticking directly in startup registration:

```js
StartupEvents.registry('block', event => {
  event.create('kubejs:aura_block')
	 .displayName('Aura Block')
	 .blockEntity(entityInfo => {
		entityInfo.tick(1, 0, entity => {
		  // every tick
		})
		entityInfo.serverTick(1, 0, entity => {
		  // every tick, server side
		})
	 })
})
```

	- Prefer this over global world/server tick scans when the behavior is block-local.
	- For block entity coordinates, use `entity.x`, `entity.y`, and `entity.z` (do not use `entity.position`).

5. **Loop variable declarations**
	- Inside any loop body (`for`, `while`, `forEach`, etc.), do not declare variables with `const`.
	- Use `let` for variables created in loops, even if they are reassigned only once.
	- Rationale for GPT behavior: in this workspace's KubeJS runtime, `let` in loops is more reliable and avoids subtle per-iteration binding/coercion issues during debugging.

6. **Startup script logic placement**
	- In `startup_scripts`, put non-trivial logic inside named `global` functions and call those functions from events/registrations.
	- Keep event callbacks thin (wire-up only), and keep operational logic in `global.*` helpers.
	- Rationale for GPT behavior: global functions are the preferred hot-reload/debug path in this workspace, so structuring startup logic this way makes iterative in-game testing faster and less error-prone.

7. **Nearest-player lookup pattern**
	- When selecting the nearest player from an entity context in this workspace, use:

```js
let nearestPlayer = entity.level.getNearestPlayer(entity, 128)
```

	- Prefer this over ad-hoc player list scans or custom nearest-player loops unless a different radius/filter is explicitly required.

8. **Direct motion application pattern**
	- When applying direct movement/force to entities in this workspace, use:

```js
entity.setMotion(motionX, motionY, motionZ)
```

	- Prefer this over `setDeltaMovement(x, y, z)` calls, which may fail with runtime method-resolution issues in this environment.

9. **Directional block placement pattern**
	- When a block needs to face toward (or away from) the player on placement, use `.property()` with `$BlockStateProperties.HORIZONTAL_FACING` and set it inside `.placementState()` using the **property object** as the key — not a string.
	- Get the player’s facing direction from `placementContext.getHorizontalDirection()` (already horizontal-only, no conversion needed).
	- Two critical rules that are easy to get wrong:
		- `ctx.set()` requires the **property object** as the first argument, not a string like `'facing'`. Passing a string will throw a `Can't find method` error at runtime.
		- Do **not** use `player.getDirection()` — that method does not exist on the KubeJS player wrapper. Use `placementContext.getHorizontalDirection()` instead.

```js
StartupEvents.registry('block', event => {
    event.create('frontiers:my_directional_block')
        .displayName('My Directional Block')
        .property($BlockStateProperties.HORIZONTAL_FACING)
        .placementState(placementContext => {
            // getHorizontalDirection() returns the direction the player is looking.
            // Use getHorizontalDirection().getOpposite() if the block should face *away* from the player instead.
            placementContext.set($BlockStateProperties.HORIZONTAL_FACING, placementContext.getHorizontalDirection())
        })
})
```

	- In the blockstates JSON, map each facing value to a y-rotation variant. South is y=0 (the model’s default forward), then +90° per 90° clockwise turn:

```json
{
    "variants": {
        "facing=south": {"model": "frontiers:block/my_directional_block", "y": 0},
        "facing=west":  {"model": "frontiers:block/my_directional_block", "y": 90},
        "facing=north": {"model": "frontiers:block/my_directional_block", "y": 180},
        "facing=east":  {"model": "frontiers:block/my_directional_block", "y": 270}
    }
}
```


10. **Block builder method availability**
	- `.noOcclusion()` is **not** an available method on the KubeJS block builder in this workspace. Do not call it when registering blocks.
	- Use `.notSolid()` and `.noCollision()` instead for non-solid decorative blocks.


````