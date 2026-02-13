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

})

