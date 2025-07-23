const fireballCollisionSounds = [
    'frontiers:fire_staff_fireball_explosion1', 'frontiers:fire_staff_fireball_explosion2', 'frontiers:fire_staff_fireball_explosion3',
    'frontiers:fire_staff_fireball_explosion4', 'frontiers:fire_staff_fireball_explosion5', 'frontiers:fire_staff_fireball_explosion6',
    'frontiers:fire_staff_fireball_explosion7', 'frontiers:fire_staff_fireball_explosion8', 'frontiers:fire_staff_fireball_explosion9',
    'frontiers:fire_staff_fireball_explosion10'
]

StartupEvents.registry('sound_event', event => {
    fireballCollisionSounds.forEach(sound => {
        event.create(sound)
    })
    event.create('frontiers:fire_staff_swing_whoosh_start')
    event.create('frontiers:fire_staff_swing_whoosh_middle')
    event.create('frontiers:fire_staff_fireball_projectile_whoosh')
})

let threeMostRecentFireCollisionSoundSelections = [] // mutiplayer

ForgeEvents.onEvent('net.minecraftforge.event.entity.living.LivingEntityUseItemEvent$Tick', event => {
    const level = event.entity.level
    const player = event.entity
    if (level === 'ClientLevel') { // maybe need to run these on server level for multiplayer?
        if (event.item === 'frontiers:fire_staff') {
            player.setYBodyRot(player.getYHeadRot())

            if (event.getDuration() === 34) {// this counts down from the max value passed to useDuration to 0
                level.playSound(player, player.block.pos, 'frontiers:fire_staff_swing_whoosh_start', "players", 1, 1)
            }
            if (event.getDuration() === 30) {// this counts down from the max value passed to useDuration to 0
                level.playSound(player, player.block.pos, 'frontiers:fire_staff_swing_whoosh_middle', "players", 1, 1)
            }
        }
    }
})