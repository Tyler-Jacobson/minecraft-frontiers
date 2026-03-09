global.HUNTABLE_BIRD_CONSTANTS = [{
    HUNTABLE_BIRD_ID: 'frontiers:zombie_crow',
    HUNTABLE_BIRD_CARCASS_ID: 'frontiers:zombie_crow_carcass',
    HUNTABLE_BIRD_PROJECTILE_ID: 'frontiers:zombie_crow_projectile',
    HUNTABLE_BIRD_EGG_ID: 'frontiers:zombie_crow_egg',
    HUNTABLE_BIRD_BAIT_ID: 'frontiers:zombie_crow_bait',
    HUNTABLE_BIRD_TEXTURE: 'frontiers:textures/entity/zombie_crow/zombie_crow.png',
    HUNTABLE_BIRD_GEO: 'frontiers:geo/entity/zombie_crow/zombie_crow.geo.json',
    HUNTABLE_BIRD_PROJECTILE_GEO: 'frontiers:geo/entity/zombie_crow/zombie_crow_projectile.geo.json',
    HUNTABLE_BIRD_PROJECTILE_TEXTURE: 'frontiers:textures/entity/zombie_crow/zombie_crow_projectile.png',
    HUNTABLE_BIRD_EGG_TEXTURE: 'frontiers:block/zombie_crow/zombie_crow_egg',
    HUNTABLE_BIRD_BAIT_TEXTURE: 'frontiers:item/zombie_crow/zombie_crow_bait',
    HUNTABLE_BIRD_DISPLAY_NAME: 'Zombie Crow',
    HUNTABLE_BIRD_CARCASS_DISPLAY_NAME: 'Zombie Crow Carcass',
    HUNTABLE_BIRD_EGG_DISPLAY_NAME: 'Zombie Crow Egg',

    HUNTABLE_BIRD_ORBIT_RADIUS: 10,
    HUNTABLE_BIRD_PROJECTILE_DAMAGE: 5,
    HUNTABLE_BIRD_PROJECTILE_RADIUS: 2,
    HUNTABLE_BIRD_EGG_MAX_HEALTH: 200,
    HUNTABLE_BIRD_EGG_MAX_PHASE: 3,
    HUNTABLE_BIRD_ORBIT_MOVE_SPEED: 0.2,
    HUNTABLE_BIRD_FLEE_MOVE_SPEED: 0.7,
    HUNTABLE_BIRD_MAX_SKINNED_STAGE: 4,
    HUNTABLE_BIRD_SKINNING_SOUND: 'minecraft:block.coral_block.hit',
    HUNTABLE_BIRD_CARCASS_DROPS: [
        { item: 'frontiers:crow_feather', count: 4 },
        { item: 'frontiers:raw_crow', count: 2 },
        { item: 'minecraft:bone', count: 1 }
    ],
    HUNTABLE_BIRD_PROJECTILE_ON_HIT: (hitEntity) => {
        hitEntity.potionEffects.add('minecraft:hunger', 20 * 20, 0, false, true)
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
},
{
    HUNTABLE_BIRD_ID: 'frontiers:crow',
    HUNTABLE_BIRD_CARCASS_ID: 'frontiers:crow_carcass',
    HUNTABLE_BIRD_PROJECTILE_ID: 'frontiers:crow_projectile',
    HUNTABLE_BIRD_EGG_ID: 'frontiers:crow_egg',
    HUNTABLE_BIRD_BAIT_ID: 'frontiers:crow_bait',
    HUNTABLE_BIRD_TEXTURE: 'frontiers:textures/entity/crow/crow.png',
    HUNTABLE_BIRD_GEO: 'frontiers:geo/entity/crow/crow.geo.json',
    HUNTABLE_BIRD_PROJECTILE_GEO: 'frontiers:geo/entity/crow/crow_projectile.geo.json',
    HUNTABLE_BIRD_PROJECTILE_TEXTURE: 'frontiers:textures/entity/crow/crow_projectile.png',
    HUNTABLE_BIRD_EGG_TEXTURE: 'frontiers:block/crow/crow_egg',
    HUNTABLE_BIRD_BAIT_TEXTURE: 'frontiers:item/crow/crow_bait',
    HUNTABLE_BIRD_DISPLAY_NAME: 'Crow',
    HUNTABLE_BIRD_CARCASS_DISPLAY_NAME: 'Crow Carcass',
    HUNTABLE_BIRD_EGG_DISPLAY_NAME: 'Crow Egg',

    HUNTABLE_BIRD_ORBIT_RADIUS: 10,
    HUNTABLE_BIRD_PROJECTILE_DAMAGE: 5,
    HUNTABLE_BIRD_PROJECTILE_RADIUS: 2,
    HUNTABLE_BIRD_EGG_MAX_HEALTH: 200,
    HUNTABLE_BIRD_EGG_MAX_PHASE: 3,
    HUNTABLE_BIRD_ORBIT_MOVE_SPEED: 0.2,
    HUNTABLE_BIRD_FLEE_MOVE_SPEED: 0.7,
    HUNTABLE_BIRD_MAX_SKINNED_STAGE: 4,
    HUNTABLE_BIRD_SKINNING_SOUND: 'minecraft:block.coral_block.hit',
    HUNTABLE_BIRD_CARCASS_DROPS: [
        { item: 'frontiers:crow_feather', count: 4 },
        { item: 'frontiers:raw_crow', count: 2 },
        { item: 'minecraft:bone', count: 1 }
    ],
    HUNTABLE_BIRD_PROJECTILE_ON_HIT: (hitEntity) => {
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
},
{
    HUNTABLE_BIRD_ID: 'frontiers:poison_crow',
    HUNTABLE_BIRD_CARCASS_ID: 'frontiers:poison_crow_carcass',
    HUNTABLE_BIRD_PROJECTILE_ID: 'frontiers:poison_crow_projectile',
    HUNTABLE_BIRD_EGG_ID: 'frontiers:poison_crow_egg',
    HUNTABLE_BIRD_BAIT_ID: 'frontiers:poison_crow_bait',
    HUNTABLE_BIRD_TEXTURE: 'frontiers:textures/entity/poison_crow/poison_crow.png',
    HUNTABLE_BIRD_GEO: 'frontiers:geo/entity/poison_crow/poison_crow.geo.json',
    HUNTABLE_BIRD_PROJECTILE_GEO: 'frontiers:geo/entity/poison_crow/poison_crow_projectile.geo.json',
    HUNTABLE_BIRD_PROJECTILE_TEXTURE: 'frontiers:textures/entity/poison_crow/poison_crow_projectile.png',
    HUNTABLE_BIRD_EGG_TEXTURE: 'frontiers:block/poison_crow/poison_crow_egg',
    HUNTABLE_BIRD_BAIT_TEXTURE: 'frontiers:item/poison_crow/poison_crow_bait',
    HUNTABLE_BIRD_DISPLAY_NAME: 'Poison Crow',
    HUNTABLE_BIRD_CARCASS_DISPLAY_NAME: 'Poison Crow Carcass',
    HUNTABLE_BIRD_EGG_DISPLAY_NAME: 'Poison Crow Egg',

    HUNTABLE_BIRD_ORBIT_RADIUS: 10,
    HUNTABLE_BIRD_PROJECTILE_DAMAGE: 5,
    HUNTABLE_BIRD_PROJECTILE_RADIUS: 2,
    HUNTABLE_BIRD_EGG_MAX_HEALTH: 200,
    HUNTABLE_BIRD_EGG_MAX_PHASE: 3,
    HUNTABLE_BIRD_ORBIT_MOVE_SPEED: 0.2,
    HUNTABLE_BIRD_FLEE_MOVE_SPEED: 0.7,
    HUNTABLE_BIRD_MAX_SKINNED_STAGE: 4,
    HUNTABLE_BIRD_SKINNING_SOUND: 'minecraft:block.coral_block.hit',
    HUNTABLE_BIRD_CARCASS_DROPS: [
        { item: 'frontiers:crow_feather', count: 4 },
        { item: 'frontiers:poison_sinew', count: 2 },
        { item: 'minecraft:bone', count: 1 }
    ],
    HUNTABLE_BIRD_PROJECTILE_ON_HIT: (hitEntity) => {
        hitEntity.potionEffects.add('minecraft:poison', 10 * 20, 0, false, true)
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
},
{
    HUNTABLE_BIRD_ID: 'frontiers:skeleton_crow',
    HUNTABLE_BIRD_CARCASS_ID: 'frontiers:skeleton_crow_carcass',
    HUNTABLE_BIRD_PROJECTILE_ID: 'frontiers:skeleton_crow_projectile',
    HUNTABLE_BIRD_EGG_ID: 'frontiers:skeleton_crow_egg',
    HUNTABLE_BIRD_BAIT_ID: 'frontiers:skeleton_crow_bait',
    HUNTABLE_BIRD_TEXTURE: 'frontiers:textures/entity/skeleton_crow/skeleton_crow.png',
    HUNTABLE_BIRD_GEO: 'frontiers:geo/entity/skeleton_crow/skeleton_crow.geo.json',
    HUNTABLE_BIRD_PROJECTILE_GEO: 'frontiers:geo/entity/skeleton_crow/skeleton_crow_projectile.geo.json',
    HUNTABLE_BIRD_PROJECTILE_TEXTURE: 'frontiers:textures/entity/skeleton_crow/skeleton_crow_projectile.png',
    HUNTABLE_BIRD_EGG_TEXTURE: 'frontiers:block/skeleton_crow/skeleton_crow_egg',
    HUNTABLE_BIRD_BAIT_TEXTURE: 'frontiers:item/skeleton_crow/skeleton_crow_bait',
    HUNTABLE_BIRD_DISPLAY_NAME: 'Skeleton Crow',
    HUNTABLE_BIRD_CARCASS_DISPLAY_NAME: 'Skeleton Crow Carcass',
    HUNTABLE_BIRD_EGG_DISPLAY_NAME: 'Skeleton Crow Egg',

    HUNTABLE_BIRD_ORBIT_RADIUS: 10,
    HUNTABLE_BIRD_PROJECTILE_DAMAGE: 5,
    HUNTABLE_BIRD_PROJECTILE_RADIUS: 2,
    HUNTABLE_BIRD_EGG_MAX_HEALTH: 200,
    HUNTABLE_BIRD_EGG_MAX_PHASE: 3,
    HUNTABLE_BIRD_ORBIT_MOVE_SPEED: 0.2,
    HUNTABLE_BIRD_FLEE_MOVE_SPEED: 0.7,
    HUNTABLE_BIRD_MAX_SKINNED_STAGE: 4,
    HUNTABLE_BIRD_SKINNING_SOUND: 'minecraft:entity.skeleton.ambient',
    HUNTABLE_BIRD_CARCASS_DROPS: [
        { item: 'frontiers:crow_feather', count: 4 },
        { item: 'frontiers:sharp_beak', count: 2 },
        { item: 'minecraft:bone', count: 1 }
    ],
    HUNTABLE_BIRD_PROJECTILE_ON_HIT: (hitEntity) => {
        hitEntity.potionEffects.add('minecraft:levitation', 8, 18, false, false)
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
}]