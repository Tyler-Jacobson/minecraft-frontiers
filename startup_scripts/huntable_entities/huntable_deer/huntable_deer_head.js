


EntityJSEvents.modifyEntity(event => {
    event.modify('frontiers:huntable_deer_head', modifyBuilder => {
        modifyBuilder.defineSyncedData(entity => {
            entity.addSyncedData("string", "bodyUUID", "default")
        })
    })
})

StartupEvents.registry('entity_type', event => {
    const builder = event.create('frontiers:huntable_deer_head', 'entityjs:tamable')
        .mobCategory('creature')
        .sized(1.2, 1.2)
        .eggItem(item => {
            item.backgroundColor(0xff0000)
            item.highlightColor(0xffbe8f)
        })
        .tick(entity => { })
    builder.onAddedToWorld(entity => {
        // entity.setPathfindingMalus(BlockPathTypes.WATER, 0.0)
        // entity.setPathfindingMalus(BlockPathTypes.WATER_BORDER, 0.0)
        // goalOnTickEvent.getNavigation().recomputePath()
    })
    builder.newGeoLayer(builder => {
        builder.textureResource(e => `frontiers:textures/entity/huntable_deer_head.png`)
    })
    builder.onHurt(context => {
        // Log the amount of damage received by the entity
        // global.runOnHurt(context)
        global.runDeerHeadOnHurt(context)
    })
    builder.aiStep(entity => {
        global.runTempAiStep(entity)
    })
    // builder.createNavigation(context => EntityJSUtils.createAmphibiousPathNavigation(context.entity, context.level))
    // builder.createNavigation(context => EntityJSUtils.createFlyingPathNavigation(context.entity, context.level))

})

global.runDeerHeadOnHurt = context => {
    // console.log(`deer ${context.entity}`)

    let headshotDamageTypes = [
        'arrow',
        'obsidian_arrow_damage',
    ]

    let deerHead = context.entity
    let level = deerHead.level
    let deerBodyUUID = deerHead.getSyncedData('bodyUUID')
    let deerBody = level.getEntity(deerBodyUUID)

    if (headshotDamageTypes.includes(context.damageSource.getType())) {
        console.log(`deer head hit by arrow`)
        deerBody.attack(context.damageAmount * 2)
        let attackingPlayer = context.damageSource.getPlayer()
        level.playSound(attackingPlayer, attackingPlayer.block.pos, 'entity.sheep.shear', "players", 1, 1)
    } else {
        // get deerbody health, then set health to health minus damage
        // doing it this way instead of entity.attack() means damage won't be doubled on attacks that hit both body and head
        // deerBody.attack(context.damageAmount)
        deerBody.setHealth(deerBody.getHealth() - context.damageAmount) // note. this idea did not work
    }

    deerBody.setSyncedData('alertness', 1000)

}

global.runTempAiStep = entity => {
    let level = entity.level
    let deerHead = entity
    if (!(level === 'ClientLevel')) {
        try {
            let deerBodyUUID = deerHead.getSyncedData('bodyUUID')
            let deerBody = level.getEntity(deerBodyUUID)
            if (!deerBody || !deerBody.isAlive()) {
                deerHead.remove('DISCARDED')
                return
            }

            let lookVector = deerBody.getLookAngle()
            let entityPosition = deerBody.position()
            let targetLocation = entityPosition.add(lookVector)
            // console.log(`deer body ${deerHead.x} ${targetLocation.x()} ${deerHead.y} ${targetLocation.y()} ${deerHead.z} ${targetLocation.z()}`)
            // lerpTo(x: number, y: number, z: number, yaw: number, pitch: number, posRotationIncrements: number, teleport: boolean): void;
            // deerHead.lerpTo(targetLocation.x(), targetLocation.y(), targetLocation.z(), 1, 1, 1, false) // apparently lerpTo is for client side only according to chat gipity
            // deerHead.setPos(targetLocation.x(), targetLocation.y() + 0.8, targetLocation.z())
            deerHead.getNavigation().moveTo(targetLocation.x(), targetLocation.y() + 0.8, targetLocation.z(), 0.5)
            // let nearbyEntities = level.getEntitiesWithin(deerHead.boundingBox.inflate(0)).filter(entity => {
            //     return !(entity.type === 'frontiers:huntable_deer_head') && !(entity.type === 'frontiers:huntable_deer_test')
            // })            
            // console.log(nearbyEntities)
        } catch (err) {
            console.error(`error lerping head ${err}`)
        }
    }
}