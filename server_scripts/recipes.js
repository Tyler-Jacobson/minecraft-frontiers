ServerEvents.recipes(event => {
    event.shaped('frontiers:fire_staff', [
        ' AF',
        ' SA',
        'S  '
    ], {
        A: 'minecraft:amethyst_shard',
        F: 'minecraft:fire_charge',
        S: 'minecraft:stick'
    })


    event.shapeless(
        Item.of('frontiers:deer_bait_block', 1), // arg 1: output
        [
            'minecraft:bone_meal',
            'minecraft:wheat_seeds' 	      // arg 2: the array of inputs
        ]
    )

    event.shaped(
        Item.of('butchersdelight:cleaver', 1), // arg 1: output
        [
            'A  ',
            'AB ', // arg 2: the shape (array of strings)
            '  B'
        ],
        {
            A: 'minecraft:leather',
            B: 'minecraft:stick',  //arg 3: the mapping object
        }
    )

    event.shaped(
        Item.of('butchersdelight:cleaver', 1), // arg 1: output
        [
            'A  ',
            'AB ', // arg 2: the shape (array of strings)
            '  B'
        ],
        {
            A: 'minecraft:flint',
            B: 'minecraft:stick',  //arg 3: the mapping object
        }
    )

    event.shaped(
        Item.of('butchersdelight:hook', 1), // arg 1: output
        [
            'A A',
            'ABA', // arg 2: the shape (array of strings)
            '   '
        ],
        {
            A: 'butchersdelight:cow_hide',
            B: 'butchersdelight:skullcow',  //arg 3: the mapping object
        }
    )

    // Plant fiber arrows (yields 8)
    event.shaped(
        Item.of('minecraft:arrow', 8),
        [
            '  A',
            ' B ',
            'C  '
        ],
        {
            A: 'minecraft:flint',
            B: 'minecraft:stick',
            C: 'frontiers:plant_fiber'
        }
    )

    // Plant fiber bow (left-handed variant)
    event.shaped(
        Item.of('minecraft:bow', 1),
        [
            'CB ',
            'C B',
            'CB '
        ],
        {
            B: 'minecraft:stick',
            C: 'frontiers:plant_fiber'
        }
    )

    // Plant fiber bow (right-handed variant)
    event.shaped(
        Item.of('minecraft:bow', 1),
        [
            ' BC',
            'B C',
            ' BC'
        ],
        {
            B: 'minecraft:stick',
            C: 'frontiers:plant_fiber'
        }
    )

    // Zombie crow bait (shapeless: 2 plant fiber + 2 wheat seeds)
    event.shapeless(
        Item.of('frontiers:zombie_crow_bait', 1),
        [
            'frontiers:plant_fiber',
            'frontiers:plant_fiber',
            'minecraft:wheat_seeds',
            'minecraft:wheat_seeds'
        ]
    )

    // Meat hook (right-handed variant)
    event.shaped(
        Item.of('frontiers:meat_hook', 1),
        [
            ' F ',
            ' FF',
            '   '
        ],
        {
            F: 'minecraft:flint'
        }
    )

    // Meat hook (left-handed variant)
    event.shaped(
        Item.of('frontiers:meat_hook', 1),
        [
            ' F ',
            'FF ',
            '   '
        ],
        {
            F: 'minecraft:flint'
        }
    )

})


