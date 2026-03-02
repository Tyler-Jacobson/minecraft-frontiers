let facingOffsets = {
    up:    [0, 1, 0],
    down:  [0, -1, 0],
    north: [0, 0, -1],
    south: [0, 0, 1],
    east:  [1, 0, 0],
    west:  [-1, 0, 0]
}

BlockEvents.rightClicked(event => {
    if (event.item.id !== 'frontiers:meat_hook') return

    let offset = facingOffsets[event.facing]
    let blockAbovePlacement = event.block.offset(offset[0], offset[1] + 1, offset[2])

    if (blockAbovePlacement.id === 'minecraft:air') {
        event.cancel()
    }
})
