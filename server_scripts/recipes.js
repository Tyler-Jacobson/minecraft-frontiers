ServerEvents.recipes(event => {
    // Remove existing recipes for items we're replacing
    event.remove({ output: 'morebows:multi_bow', type: 'minecraft:crafting_shaped' })
    event.remove({ output: 'morebows:multi_bow', type: 'minecraft:crafting_shapeless' })
    event.remove({ output: 'call_of_yucutan:flint_spear', type: 'minecraft:crafting_shaped' })
    event.remove({ output: 'call_of_yucutan:flint_spear', type: 'minecraft:crafting_shapeless' })
    event.remove({ output: 'minecraft:bundle', type: 'minecraft:crafting_shaped' })
    event.remove({ output: 'minecraft:bundle', type: 'minecraft:crafting_shapeless' })
    event.remove({ output: 'rediscovered:purple_arrow', type: 'minecraft:crafting_shaped' })
    event.remove({ output: 'rediscovered:purple_arrow', type: 'minecraft:crafting_shapeless' })

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
            ' A ',
            ' B ',
            ' C '
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

    // Huntable bird bait recipes (from crow_constants)
    global.HUNTABLE_BIRD_CONSTANTS.forEach(birdConfig => {
        event.shapeless(
            Item.of(birdConfig.HUNTABLE_BIRD_BAIT_ID, 1),
            birdConfig.HUNTABLE_BIRD_BAIT_RECIPE
        )
    })

    // Cooked crow (furnace, smoker, campfire)
    event.smelting('frontiers:cooked_crow', 'frontiers:raw_crow').xp(0.35)
    event.smoking('frontiers:cooked_crow', 'frontiers:raw_crow').xp(0.35)
    event.campfireCooking('frontiers:cooked_crow', 'frontiers:raw_crow').xp(0.35)

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

    // Multi bow (left-handed variant)
    event.shaped(
        Item.of('morebows:multi_bow', 1),
        [
            'PS ',
            'P S',
            'PS '
        ],
        {
            P: 'frontiers:poison_sinew',
            S: 'minecraft:stick'
        }
    )

    // Multi bow (right-handed variant)
    event.shaped(
        Item.of('morebows:multi_bow', 1),
        [
            ' SP',
            'S P',
            ' SP'
        ],
        {
            P: 'frontiers:poison_sinew',
            S: 'minecraft:stick'
        }
    )

    // Flint spear (right-handed variant)
    event.shaped(
        Item.of('call_of_yucutan:flint_spear', 1),
        [
            ' FB',
            ' SF',
            'S  '
        ],
        {
            F: 'minecraft:flint',
            S: 'minecraft:stick',
            B: 'frontiers:sharp_beak'
        }
    )

    // Flint spear (left-handed variant)
    event.shaped(
        Item.of('call_of_yucutan:flint_spear', 1),
        [
            'BF ',
            'FS ',
            '  S'
        ],
        {
            F: 'minecraft:flint',
            S: 'minecraft:stick',
            B: 'frontiers:sharp_beak'
        }
    )

    // Bundle
    event.shaped(
        Item.of('minecraft:bundle', 1),
        [
            ' T ',
            'Z Z',
            ' Z '
        ],
        {
            T: 'minecraft:string',
            Z: 'frontiers:zombie_crow_flesh'
        }
    )

    // Purple arrow (yields 4)
    event.shaped(
        Item.of('rediscovered:purple_arrow', 4),
        [
            ' F ',
            ' B ',
            ' C '
        ],
        {
            F: 'minecraft:flint',
            B: 'minecraft:bone',
            C: 'frontiers:crow_feather'
        }
    )

})


