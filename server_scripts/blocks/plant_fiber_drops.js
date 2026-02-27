const PLANT_FIBER_DROP_CHANCE = 1 / 8

const PLANT_FIBER_DROP_BLOCKS = [
    'minecraft:grass',
    'minecraft:tall_grass',
    'environmental:giant_tall_grass'
]

BlockEvents.broken(event => {
    if (!PLANT_FIBER_DROP_BLOCKS.includes(event.block.id)) {
        return
    }

    let heldItem = event.player.getMainHandItem()
    if (heldItem && heldItem.id === 'minecraft:shears') {
        return
    }

    if (Math.random() >= PLANT_FIBER_DROP_CHANCE) {
        return
    }

    event.block.popItem(Item.of('frontiers:plant_fiber'))
})