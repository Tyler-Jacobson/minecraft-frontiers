console.info('Loaded Fire Staff Startup Script')
// priority: 0

const $EnchantmentCategory = Java.loadClass(
    'net.minecraft.world.item.enchantment.EnchantmentCategory'
)

const fireballCollisionSounds = [
    'frontiers:grenade_1_short_mono', 'frontiers:grenade_2_short_mono', 'frontiers:grenade_3_short_mono',
    'frontiers:grenade_4_short_mono', 'frontiers:grenade_5_short_mono', 'frontiers:grenade_6_short_mono',
    'frontiers:grenade_7_short_mono', 'frontiers:grenade_8_short_mono', 'frontiers:grenade_9_short_mono',
    'frontiers:grenade_10_short_mono'
]

StartupEvents.registry('sound_event', event => {
    fireballCollisionSounds.forEach(sound => {
        event.create(sound)
    })
    event.create('frontiers:fire_whoosh')
    event.create('frontiers:fire_whoosh_start3')
    event.create('frontiers:fire_projectile_whoosh5')

})

const allowedEnchantsForFireStaff = [
    "minecraft:power",
    "minecraft:unbreaking",
    "minecraft:mending",
    "frontiers:kindness"
]

const allowedEnchantsForIceStaff = [
    "minecraft:power",
    "minecraft:unbreaking",
    "minecraft:mending",
    "minecraft:quickdraw"
]


const customItemEnchantmentDefinitions = [
    {
        'id': 'frontiers:fire_staff',
        'allowed_enchantments': allowedEnchantsForFireStaff
    },
    {
        'id': 'frontiers:ice_staff',
        'allowed_enchantments': allowedEnchantsForIceStaff
    }
]

ForgeEvents.onEvent('net.minecraftforge.event.AnvilUpdateEvent', (event) => {
    try {
        let { left, right, name, cost, player } = event
        console.info(`accessed anvil menu ref ${global.anvilMenuRef}`)
        let modifiedInputItemNBTData = left.nbt.copy()

        if (!(event.getPlayer().level === 'ClientLevel')) {
            if ((left.id === 'frontiers:fire_staff') && (right.id === 'minecraft:enchanted_book')) {

                let anvilMenuData = global.anvilMenuRef
                let getOutputItem = anvilMenuData.getInventoryContainer().getSlot(2).getItem()

                let outputItemEnchantmentsCopy = getOutputItem.getEnchantmentTags().copy()
                let outputItemEnchantsList = outputItemEnchantmentsCopy.filter(enchantment => allowedEnchantsForFireStaff.includes(enchantment.id))


                let newFireStaffItem = Item.of('frontiers:fire_staff')
                if (outputItemEnchantsList.length) { // needed for now but there is a better way to do this. maybe just wait 1 tick
                    newFireStaffItem.nbt.putInt('Damage', modifiedInputItemNBTData.getInt('Damage')) // working
                    newFireStaffItem.nbt.putInt('RepairCost', anvilMenuData.getInventoryContainer().calculateIncreasedRepairCost(cost)) // working
                    newFireStaffItem.nbt.put('Enchantments', outputItemEnchantsList) // working
                    if (left.nbt.get('display')) {
                        newFireStaffItem.nbt.put('display', left.nbt.get('display')) // working
                    }
                    event.setOutput(newFireStaffItem)
                }
            }
        }
    } catch (err) {
        console.error(`Error in Fire Staff ForgeEvents.onEvent AnvilUpdateEvent; ${err}`)
    }
})

const FIRESTAFF_BASE_REPAIR_COST = 1
const FIRESTAFF_BASE_DAMAGE = 17

let nextFireStaffSwingAnimation = 8 // multiplayer

let threeMostRecentFireCollisionSoundSelections = [] // mutiplayer

StartupEvents.registry("enchantment", (event) => {
    event.create('frontiers:kindness')
        .minLevel(1)
        .maxLevel(1)
        .category(
            $EnchantmentCategory.create('fire_staff', (i) => {
                return i.id == 'frontiers:fire_staff'
            })
        )
        .canEnchant((/** @type {Internal.ItemStack} */ i) => {
            return i.id == 'frontiers:fire_staff' || i.id == 'minecraft:book' // this works
        })
        .minCost((level) => {
            return 15
        })
        .maxCost((level) => {
            return 31
        })
        .rarity('uncommon')
        .displayName('Kindness')
})

ForgeEvents.onEvent('net.minecraftforge.event.entity.living.LivingEntityUseItemEvent$Tick', event => {
    const level = event.entity.level
    const player = event.entity
    if (level === 'ClientLevel') { // maybe need to run these on server level for multiplayer?
        if (event.item === 'frontiers:fire_staff') {
            player.setYBodyRot(player.getYHeadRot())

            if (event.getDuration() === 34) {// this counts down from the max value passed to useDuration to 0
                level.playSound(player, player.block.pos, 'frontiers:fire_whoosh_start3', "players", 1, 1)
            }
            if (event.getDuration() === 30) {// this counts down from the max value passed to useDuration to 0
                level.playSound(player, player.block.pos, 'frontiers:fire_whoosh', "players", 1, 1)
            }

        }
    }
})

StartupEvents.registry("item", event => {
    event.create("frontiers:fire_staff", 'sword')
        .use((level, player, hand) => {
            if (!(level === 'ClientLevel')) {
                if (nextFireStaffSwingAnimation === 8) {
                    player.triggerAnimation("frontiers:firestaff_animation8")
                    nextFireStaffSwingAnimation = 9
                } else if (nextFireStaffSwingAnimation === 9) {
                    player.triggerAnimation("frontiers:firestaff_animation9") // firestaff_animation9
                    nextFireStaffSwingAnimation = 10
                } else if (nextFireStaffSwingAnimation === 10) {
                    player.triggerAnimation("frontiers:firestaff_animation10") // firestaff_animation10
                    nextFireStaffSwingAnimation = 8
                }
            }
            return true
        })
        .maxDamage(382)
        .finishUsing((itemstack, level, entity) => {
            if (!entity.player) return itemstack
            return global.finishUsingFireCrystal(itemstack, level, entity) // multiplayer. does this need to be global?
        })
        .releaseUsing((itemstack, level, player) => {
            if (!(level === 'ClientLevel')) {
                if (nextFireStaffSwingAnimation === 8) { // if 8, 10 must have been canceled. Re-queue 10
                    player.stopAnimation("frontiers:firestaff_animation10");
                    nextFireStaffSwingAnimation = 10
                } else if (nextFireStaffSwingAnimation === 9) { // if 9, 8 must have been canceled. Re-queue 8
                    player.stopAnimation("frontiers:firestaff_animation8");
                    nextFireStaffSwingAnimation = 8
                } else if (nextFireStaffSwingAnimation === 10) {
                    player.stopAnimation("frontiers:firestaff_animation9");
                    nextFireStaffSwingAnimation = 9
                }
            }
        })
        .useDuration(itemstack => 40) // how many ticks to charge up weapon before calling .finishUsing
})

StartupEvents.registry('entity_type', event => {
    event.create("frontiers:fireball1", "entityjs:geckolib_projectile").onHitEntity(context => {
        // 'entity' in this context is the projectile that is spawned
        // 'result.entity' in this context is the target that is hit by the projectile
        const { entity, result } = context;

        // The 'entity' (projectile) has a list of possible damage sources on it, accessed through damageSources()
        // to set the player as the source of damage, we choose .playerAttack() as the damage source,
        // which requires a reference to the player be passed to it.
        // This can be any player reference, in this case we're using entity.getOwner(), 
        // which is a value we set to be the player with this line in global.exampleFinishUsing below when spawning the projectile:
        const player = entity.getOwner()
        const damageSource = entity.damageSources().playerAttack(player)
        const world = player.level

        const randomFireballCollisionSound = getRandomSound(fireballCollisionSounds, threeMostRecentFireCollisionSoundSelections)

        world.playSound(entity, entity.block.pos, randomFireballCollisionSound, "players", 3, 1)

        const collisionX = result.entity.x
        const collisionY = result.entity.y
        const collisionZ = result.entity.z

        world.spawnParticles("explosiveenhancement:fireball", false, collisionX, collisionY + 1, collisionZ, 1, 1, 1, 7, 1) // some of the particles from explosive enhancements require speed of 1 in order to display
        world.spawnParticles("explosiveenhancement:smoke", false, collisionX, collisionY + 1, collisionZ, 1, 1, 1, 10, 0.1) // some of the particles from explosive enhancements require speed of 1 in order to display
        world.spawnParticles("explosiveenhancement:blastwave", false, collisionX, collisionY + 1, collisionZ, 1, 1, 1, 3, 1) // some of the particles from explosive enhancements require speed of 1 in order to display

        // we now get rid of the projectile entity
        entity.kill()

        const RADIUS = 3

        const hitEntity = result.entity

        const { xsize, ysize, zsize } = hitEntity.boundingBox

        const nearbyEntities = hitEntity.level.getEntitiesWithin(hitEntity.boundingBox.deflate(xsize, ysize, zsize).inflate(RADIUS)).filter(entity => entity.living)

        nearbyEntities.forEach((nearbyEntity) => {
            nearbyEntity.setRemainingFireTicks(100)
            nearbyEntity.attack(damageSource, FIRESTAFF_BASE_DAMAGE)
        })
    }).onHitBlock(context => {
        const { entity } = context

        const player = entity.getOwner()
        const damageSource = entity.damageSources().playerAttack(player)
        const world = player.level

        const randomFireballBlockCollisionSound = getRandomSound(fireballCollisionSounds, threeMostRecentFireCollisionSoundSelections)

        world.playSound(entity, entity.block.pos, randomFireballBlockCollisionSound, "players", 3, 1)

        const collisionX = entity.x
        const collisionY = entity.y
        const collisionZ = entity.z

        world.spawnParticles("explosiveenhancement:fireball", false, collisionX, collisionY + 1, collisionZ, 1, 1, 1, 7, 1) // some of the particles from explosive enhancements require speed of 1 in order to display
        world.spawnParticles("explosiveenhancement:smoke", false, collisionX, collisionY + 1, collisionZ, 1, 1, 1, 10, 0.1) // some of the particles from explosive enhancements require speed of 1 in order to display
        world.spawnParticles("explosiveenhancement:blastwave", false, collisionX, collisionY + 1, collisionZ, 1, 1, 1, 3, 1) // some of the particles from explosive enhancements require speed of 1 in order to display

        const RADIUS = 3

        const hitEntity = entity

        const { xsize, ysize, zsize } = hitEntity.boundingBox

        const nearbyEntities = hitEntity.level.getEntitiesWithin(hitEntity.boundingBox.deflate(xsize, ysize, zsize).inflate(RADIUS)).filter(entity => entity.living)

        nearbyEntities.forEach((nearbyEntity) => {
            nearbyEntity.setRemainingFireTicks(100)
            nearbyEntity.attack(damageSource, FIRESTAFF_BASE_DAMAGE)

        })

        entity.kill()
    }).tick(entity => {
        const world = entity.level

        const collisionX = entity.x
        const collisionY = entity.y
        const collisionZ = entity.z

        if (entity.age === 3) {
            world.playSound(entity, entity.block.pos, 'frontiers:fire_projectile_whoosh5', "players", 1, 1)
        }

        const smokeParticleYOffset = 0.3
        const smokeParticleCountPerTick = 1
        const smokeParticleSpeedPerTick = 0
        
        const lavaParticleCountPerTick = 1
        const lavaParticleSpeedPerTick = 20

        world.spawnParticles("minecraft:smoke", false, collisionX, collisionY + smokeParticleYOffset, collisionZ, 0, 0, 0, smokeParticleCountPerTick, smokeParticleSpeedPerTick)
        world.spawnParticles("minecraft:lava", false, collisionX, collisionY, collisionZ, 0, 0, 0, lavaParticleCountPerTick, lavaParticleSpeedPerTick)
    })
})

const spawnFireball = (player, level, eyePosition, lookAngle) => {
    const projectile = level.createEntity("frontiers:fireball1");
    // it's crucial to set the projectile entity's owner here, since we're later going to reference this in order to get the damage source
    projectile.setOwner(player)
    const vel = lookAngle.scale(1.5)
    projectile.setMotion(vel.x(), vel.y() + 0.1, vel.z())
    projectile.setPosition(eyePosition.x(), eyePosition.y() - 0.5, eyePosition.z())
    projectile.setNoGravity(false)
    projectile.spawn()
}

global.finishUsingFireCrystal = (/**@type {Internal.ItemStack}*/itemstack, /**@type {Internal.Level}*/level, /**@type {Internal.Player}*/player) => {
    const { usedItemHand, inventory, lookAngle, eyePosition } = player

    player.addItemCooldown(itemstack.item, 0) // itemcooldown 0 is perfect for gat mode
    player.damageHeldItem(usedItemHand, 1)

    spawnFireball(player, level, eyePosition, lookAngle)

    return itemstack
}