
global.HUNTABLE_BIRD_CONSTANTS = {
    HUNTABLE_BIRD_ID: 'frontiers:zombie_crow',
    HUNTABLE_BIRD_CARCASS_ID: 'frontiers:zombie_crow_carcass',
    HUNTABLE_BIRD_PROJECTILE_ID: 'frontiers:zombie_crow_projectile',
    HUNTABLE_BIRD_EGG_ID: 'frontiers:zombie_crow_egg',
    HUNTABLE_BIRD_BAIT_ID: 'frontiers:zombie_crow_bait',
    HUNTABLE_BIRD_TEXTURE: 'frontiers:textures/entity/zombie_crow/zombie_crow.png',

    HUNTABLE_BIRD_ORBIT_RADIUS: 10,
    HUNTABLE_BIRD_PROJECTILE_DAMAGE: 5,
    HUNTABLE_BIRD_PROJECTILE_RADIUS: 2,
    HUNTABLE_BIRD_EGG_MAX_HEALTH: 200,
    HUNTABLE_BIRD_EGG_MAX_PHASE: 3,
    HUNTABLE_BIRD_ORBIT_MOVE_SPEED: 0.2,
    HUNTABLE_BIRD_FLEE_MOVE_SPEED: 0.7,
    HUNTABLE_BIRD_MAX_SKINNED_STAGE: 4,
    HUNTABLE_BIRD_CARCASS_DROPS: [
        { item: 'frontiers:crow_feather', count: 4 },
        { item: 'frontiers:raw_crow', count: 2 },
        { item: 'minecraft:bone', count: 1 }
    ],
    HUNTABLE_BIRD_PROJECTILE_ON_HIT: (hitEntity) => {
        hitEntity.setRemainingFireTicks(100)
    },
    HUNTABLE_BIRD_ATTACK_MATRICES: [
        [
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, -1, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0]
        ],
        [
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 5, 0, -1, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0]
        ],
        [
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 5, 10, -1, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0]
        ]
    ]
}