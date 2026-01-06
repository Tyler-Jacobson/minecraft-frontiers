// server_scripts/boss_example.js

// CONFIG — change these to match your boss
const BOSS_ENTITY_ID = 'frontiers:custom_kraken'        // or 'yourmod:ancient_titan' if using EntityJS
const BOSSBAR_ID = 'frontiers:custom_kraken'       // namespaced id for /bossbar
const BOSS_NAME = 'Void Kraken'
const MAX_HEALTH = 100

// Utility to (silently) run vanilla commands
function cmd(server, str) { server.runCommandSilent(str) }

// Create bossbar at server start (hidden until a boss spawns)
ServerEvents.loaded(event => {
  const s = event.server
  cmd(s, `bossbar add ${BOSSBAR_ID} {"text":"${BOSS_NAME}","color":"red"}`)
  cmd(s, `bossbar set ${BOSSBAR_ID} color red`)
  cmd(s, `bossbar set ${BOSSBAR_ID} style notched_20`)
  cmd(s, `bossbar set ${BOSSBAR_ID} visible false`)
})

EntityEvents.spawned(e => {
  const s = e.server
  const entity = e.entity
  if (e.entity.type !== 'block_factorys_bosses:infernal_dragon') return
  entity.setMaxHealth(100)
  entity.setHealth(100)
})

// When boss spawns: show bar, set max/value, assign nearby players
EntityEvents.spawned(e => {
  const s = e.server
  const entity = e.entity
  if (e.entity.type !== BOSS_ENTITY_ID) return
  entity.setMaxHealth(MAX_HEALTH)
  entity.setHealth(MAX_HEALTH)

  const max = Math.floor(MAX_HEALTH)
  const hp = Math.max(0, Math.floor(e.entity.health))

  cmd(s, `bossbar set ${BOSSBAR_ID} max ${max}`)
  cmd(s, `bossbar set ${BOSSBAR_ID} value ${hp}`)

  // Add players in 64-block radius as viewers
  const cx = Math.floor(e.entity.x)
  const cy = Math.floor(e.entity.y)
  const cz = Math.floor(e.entity.z)
  cmd(s, `bossbar set ${BOSSBAR_ID} players @a[distance=..64,x=${cx},y=${cy},z=${cz}]`)
  cmd(s, `bossbar set ${BOSSBAR_ID} visible true`)

  // Optional: tag the entity so our other handlers know it's "the boss"
  e.entity.addTag('kjs_boss')
})

// Update bar and handle phases on damage
EntityEvents.hurt(e => {
  if (!e.entity.tags.contains('kjs_boss')) return

  const s = e.server
  const hp = Math.max(0, Math.floor(e.entity.health - e.getDamage())) // post-damage health
  cmd(s, `bossbar set ${BOSSBAR_ID} value ${hp}`)

  // Simple phase gates
  const pct = hp / e.entity.maxHealth
  if (pct <= 0.66 && !e.entity.tags.contains('phase2')) {
    e.entity.addTag('phase2')
    // Example: enraged buffs, minion spawn, etc.
    // cmd(s, `summon minecraft:vex ${Math.floor(e.entity.x)} ${Math.floor(e.entity.y)} ${Math.floor(e.entity.z)}`)
  }
  if (pct <= 0.33 && !e.entity.tags.contains('phase3')) {
    e.entity.addTag('phase3')
    // More mechanics...
  }
})

// Clean up bossbar when boss dies
EntityEvents.death(e => {
  if (!e.entity.tags.contains('kjs_boss')) return
  const s = e.server
  cmd(s, `bossbar set ${BOSSBAR_ID} visible false`)
  cmd(s, `bossbar set ${BOSSBAR_ID} players`) // clears viewers
})

// Gate natural spawns if you need special conditions (structure/biome/dimension/time)
EntityEvents.checkSpawn(e => {
  if (e.entity.type !== BOSS_ENTITY_ID) return
  // Example: only allow in The End
  if (e.level.dimension !== 'minecraft:the_end') {
    e.cancel() // deny spawn
  }
})

// Tuneables
const VIEW_RADIUS = 64   // who can see the bar
const TICK_INTERVAL = 20   // ~1s

let _audienceTicker = 0

LevelEvents.tick(event => {
  const s = event.server
  _audienceTicker++
  if (_audienceTicker % TICK_INTERVAL !== 0) return

  // Refresh the viewer list around each boss (by tag) using vanilla commands.
  // 1) Update players list relative to each boss position
  // 2) Show if anyone is nearby; hide if nobody is nearby

  // (1) Assign viewers within radius of EACH active boss
  s.runCommandSilent(
    `execute as @e[tag=kjs_boss] at @s run bossbar set ${BOSSBAR_ID} players @a[distance=..${VIEW_RADIUS}]`
  )

  // (2a) If someone is nearby this boss → visible true
  s.runCommandSilent(
    `execute as @e[tag=kjs_boss] at @s if entity @a[distance=..${VIEW_RADIUS}] run bossbar set ${BOSSBAR_ID} visible true`
  )

  // (2b) If *no* one is nearby this boss → visible false
  s.runCommandSilent(
    `execute as @e[tag=kjs_boss] at @s unless entity @a[distance=..${VIEW_RADIUS}] run bossbar set ${BOSSBAR_ID} visible false`
  )
})