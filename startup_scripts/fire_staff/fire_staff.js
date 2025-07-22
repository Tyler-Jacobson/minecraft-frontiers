console.info('Loaded Fire Staff Startup Script')
// priority: 0

const $EnchantmentCategory = Java.loadClass(
    'net.minecraft.world.item.enchantment.EnchantmentCategory'
)
const BuiltInRegistries = Java.loadClass("net.minecraft.core.registries.BuiltInRegistries");
const $AnvilMenu = Java.loadClass("net.minecraft.world.inventory.AnvilMenu")
const $ItemCombinerMenu = Java.loadClass("net.minecraft.world.inventory.ItemCombinerMenu")
const ItemCombinerMenuSlotDefinition = Java.loadClass("net.minecraft.world.inventory.ItemCombinerMenuSlotDefinition")
// function fireballSlowdownCallback(projectile, level) {
//     //changes the scope of itemEntity (otherwise if used 2 times in a row within 5 seconds, problems would occur)
//     level.server.scheduleInTicks(20, callback => { // this code runs 5 seconds later
//         projectile.setMotion(vel.x(), -0.5, vel.z())
//     })
// }

// ForgeEvents.onEvent('net.minecraftforge.eventbus.api.Event', (event) => {
//     console.info(event)
// })

// ForgeEvents.onEvent('net.minecraftforge.client.event.InputEvent$InteractionKeyMappingTriggered', (event) => {
//     console.info(`shot in the dark 1 ${event}`)
// })

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



let hasDoneSingleAnvilIteration = false

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
                    console.info(`set output to: ${newFireStaffItem} with ${newFireStaffItem.nbt}`)
                    newFireStaffItem.nbt.putInt('Damage', modifiedInputItemNBTData.getInt('Damage')) // working
                    newFireStaffItem.nbt.putInt('RepairCost', anvilMenuData.getInventoryContainer().calculateIncreasedRepairCost(cost)) // working
                    newFireStaffItem.nbt.put('Enchantments', outputItemEnchantsList) // working
                    if (left.nbt.get('display')) {
                        newFireStaffItem.nbt.put('display', left.nbt.get('display')) // working
                    }

                    // let enenchantsNbtString = newFireStaffItem.nbt.getString('Enchantments')
                    // let enenchantsNbtString = newFireStaffItem.nbt.getTagType('Enchantments')

                    console.info(`enenchantsNbtString1 ${left.nbt.getString('display')}`)
                    console.info(`enenchantsNbtString2 ${left.nbt.getTagType('display')}`)
                    console.info(`enenchantsNbtString3 ${left.getDisplayName()}`)
                    console.info(`enenchantsNbtString4 ${left.nbt.getAllKeys()}`)
                    // console.info(`enenchantsNbtString5 ${left.nbt.getByteArray('Enchantments')}`)
                    // console.info(`enenchantsNbtString6 ${left.nbt.getIntArray('Enchantments')}`)
                    console.info(`enenchantsNbtString7 ${left.nbt.get('display')}`)

                    // console.info(`enenchantsNbtString7 ${}`)

                    // newFireStaffItem.nbt.put('Enchantments', [{id:"minecraft:power",lvl:3}])

                    // newFireStaffItem.enchant(outputItemEnchantsList)
                    // newFireStaffItem.appendEnchantmentNames(['Enchantments'], [{id:"minecraft:power",lvl:3}])
                    event.setOutput(newFireStaffItem)
                    console.info(`iteration of newFireStaffItem ${newFireStaffItem.nbt}`)
                    // hasDoneSingleAnvilIteration = false
                } else {
                    hasDoneSingleAnvilIteration = true
                }


                // console.info(`accessed global anvil menu ref ${anvilMenuData}`)
                // console.info(`2 ${anvilMenuData.getInventoryContainer()}`)
                // console.info(`3 ${anvilMenuData.getInventoryContainer().calculateIncreasedRepairCost(2)}`)
                // console.info(`4 ${anvilMenuData.getInventoryContainer().getCost()}`)
                // // console.info(`5 ${anvilMenuData.getInventoryContainer().getSlot(0)}`)
                // // console.info(`6 ${anvilMenuData.getInventoryContainer().getSlot(1)}`)
                // console.info(`7 ${anvilMenuData.getInventoryContainer().getSlot(2).hasItem()}`)
                // console.info(`8 ${anvilMenuData.getInventoryContainer().getSlot(2).getItem()}`)
            }
        }



        // let test = $AnvilMenu.calculateIncreasedRepairCost(2) // actually works. can only access static methods
        // let test = $ItemCombinerMenu.createResult()
        // // let test = event.getClass().getCaller() // event.getClass().caller
        // console.info(`test1 ${test}`)

        // console.info(`pt1 ${left} ${right} ${name} ${cost} ${player}`)
        // console.info(`pt2 ${event.getLeft()} ${event.getRight()} ${event.getName()} ${event.getCost()} ${event.getPlayer()}`)
        // console.info(`pt3 ${event.getListenerList()} ${event.getPhase()} ${event.getResult()} ${event.hasResult()} ${event.isCancelable()}`)
        // console.info(`pt4 ${$ItemCombinerMenu} ${$ItemCombinerMenu} ${$ItemCombinerMenu} ${$ItemCombinerMenu}`)
        // console.info(`pt5 ${ItemCombinerMenuSlotDefinition.SlotDefinition}`) // come back to this
        // console.info(`pt6 ${$AnvilMenu.RESULT_SLOT} ${$AnvilMenu.INPUT_SLOT}`)
        // console.info(`pt7 ${event} ${Object.keys(event)}`)
        // try {
        //     console.info(event.getClass())
        // } catch (e) {
        //     console.error(e)
        // } try {
        //     console.info(event.getPlayer())
        // } catch (e) {
        //     console.error(e)
        // } try {
        //     console.info(event.getName())
        // } catch (e) {
        //     console.error(e)
        // } try {
        //     console.info(event.getListenerList())
        // } catch (e) {
        //     console.error(e)
        // } try {
        //     console.info(event.isCanceled())
        // } catch (e) {
        //     console.error(e)
        // } try {
        //     console.info(event.cancelable)
        // } catch (e) {
        //     console.error(e)
        // }
        // // try {
        // //     console.info(event.notifyAll())
        // // } catch (e) {
        // //     console.error(e)
        // // }
        // try {
        //     console.info(event.materialCost)
        // } catch (e) {
        //     console.error(e)
        // }
        // try {
        //     console.info(event.result)
        // } catch (e) {
        //     console.error(e)
        // }
        // try {
        //     console.info(event.output)
        // } catch (e) {
        //     console.error(e)
        // }
        // try {
        //     console.info(event.hashCode())
        // } catch (e) {
        //     console.error(e)
        // }
        // try {
        //     console.info(event.getMaterialCost())
        // } catch (e) {
        //     console.error(e)
        // }
        // try {
        //     console.info(event.class)
        // } catch (e) {
        //     console.error(e)
        // }
        // try {
        //     console.info(event.getOutput())
        // } catch (e) {
        //     console.error(e)
        // }
        // try {
        //     console.info(event.hasResult())
        // } catch (e) {
        //     console.error(e)
        // }
        // try {
        //     console.info(event.equals(left))
        // } catch (e) {
        //     console.error(e)
        // }

        // console.info(`pt8 ${event.getClass()} ${event.getPlayer()} ${event.getName()} ${event.getListenerList()} ${event.isCanceled()} ${event.cancelable} ${event.notifyAll()} ${event.materialCost} ${event.result()} ${event.output()} ${event.getListenerList()} ${event.hashCode()} ${event.getMaterialCost()} ${event.class()} ${event.getOutput()} ${event.hasResult()} ${event.equals()}`)


    } catch (err) {
        console.error(`my error; ${err}`)
    }

})

// ForgeEvents.onEvent('net.minecraftforge.event.AnvilUpdateEvent', (event) => {
//     try {
//         let { left, right, name, cost, player } = event

//         console.info(`pt1 ${left} ${right} ${name} ${cost} ${player}`)
//         console.info(`pt2 ${event.getLeft()} ${event.getRight()} ${event.getName()} ${event.getCost()} ${event.getPlayer()}`)
//         console.info(`pt3 ${event.getListenerList()} ${event.getPhase()} ${event.getResult()} ${event.hasResult()} ${event.isCancelable()}`)
//         // console.info(`pt4 ${$ItemCombinerMenu} ${$ItemCombinerMenu} ${$ItemCombinerMenu} ${$ItemCombinerMenu}`)
//         // console.info(`pt5 ${ItemCombinerMenuSlotDefinition.SlotDefinition}`) // come back to this
//         console.info(`pt6 ${$AnvilMenu.RESULT_SLOT} ${$AnvilMenu.INPUT_SLOT}`)


//     } catch(err) {
//         console.error(`my error; ${err}`)
//     }

// })

const FIRESTAFF_BASE_REPAIR_COST = 1
const FIRESTAFF_BASE_DAMAGE = 17

let nextFireStaffSwingAnimation = 8



let threeMostRecentFireCollisionSoundSelections = []

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
            // console.log(i)
            return i.id == 'frontiers:fire_staff' || i.id == 'minecraft:book' // this works
        })
        .minCost((level) => {
            // can maybe use this to make the enchant only spawn on more expensive levels?
            // ^ this works. 20 / 30 makes it never spawn though
            // console.log(level)
            return 15
        })
        .maxCost((level) => {
            // console.log(level)
            return 31
        })
        .rarity('uncommon')
        .displayName('Kindness')
})






const getEntitiesInRadiusFromEntity = ((startingEntity, radius) => {
    startingEntity.getLevel().getEntitiesWithin()
})

// let hasCanceledCharge = false

// const runDelayedCodeOnItemCharge = (maxChargeTick, runCallbackOnTick, callback) => {

//     const returnedChargeTick = handleChargingTick(0, 40)
//     console.info(`returnedChargeTick ${returnedChargeTick}`)
// }

// const handleChargingTick = (lastChargeTick, maxChargeTick) => {

//     const currentChargeTick = (lastChargeTick ?? 0) + 1
//     if (currentChargeTick > (maxChargeTick ?? 100)) {
//         return
//     }
//     console.info(`currentChargeTick ${currentChargeTick} ${hasCanceledCharge}`)

//     Client.scheduleInTicks(1, event => { // seems to require all vars in main method to be redeclarable
//         if (!hasCanceledCharge) {
//             handleChargingTick(currentChargeTick)
//         }
//     });
//     return currentChargeTick
// }

ForgeEvents.onEvent('net.minecraftforge.event.entity.living.LivingEntityUseItemEvent$Tick', event => {
    const level = event.entity.level
    const player = event.entity
    if (level === 'ClientLevel') {
        if (event.item === 'frontiers:fire_staff') {
            // console.info(`player.getYHeadRot() ${player.getYHeadRot()}`)
            // console.info(`player.yBodyRot ${player.yBodyRot}`)
            player.setYBodyRot(player.getYHeadRot())

            if (event.getDuration() === 34) {// this counts down from the max value passed to useDuration to 0
                level.playSound(player, player.block.pos, 'frontiers:fire_whoosh_start3', "players", 1, 1)
            }
            if (event.getDuration() === 30) {// this counts down from the max value passed to useDuration to 0
                level.playSound(player, player.block.pos, 'frontiers:fire_whoosh', "players", 1, 1)
            }
            // if (event.getDuration() === 20) {// this counts down from the max value passed to useDuration to 0
            //     level.playSound(player, player.block.pos, 'frontiers:loading_middle1', "players", 1, 1)
            // }

        }
    } else { // level === ServerLevel
        if (event.item === 'frontiers:fire_staff') {

            // if (event.getDuration() === 40) {// this counts down from the max value passed to useDuration to 0
            //     console.info('tick event triggers at 40')
            //     player.stopAnimation("frontiers:firestaff_animation9");
            //     player.triggerAnimation("frontiers:firestaff_animation9")
            // }

        }
    }
})



// const filterAllowedEnchantsForItem = (fullEnchantList, allowedEnchants) => {

// }

// const handleEnchantmentUpgrade = (rightSideEnchant, leftSideEnchantmentsList) => {

//     let upgradeMatch = leftSideEnchantmentsList.find((leftSideEnchant) => {
//         console.info(`left ${leftSideEnchant} right ${rightSideEnchant}`)
//         return (rightSideEnchant?.id === leftSideEnchant?.id) && (rightSideEnchant?.lvl === leftSideEnchant?.lvl)
//     })
//     if (!upgradeMatch) {
//         console.info(`no upgrade match found: ${upgradeMatch}`)
//         return null
//     }

//     console.info(`upgrade match1 ${upgradeMatch}`)

//     const forgeRegistryEnch = BuiltInRegistries.ENCHANTMENT.entrySet().find(enchantmentRegistryEntry => {
//         // console.info(`enchantmentRegistryEntry.key.location() ${enchantmentRegistryEntry.key.location()}`)
//         return enchantmentRegistryEntry.key.location() === upgradeMatch?.id
//     })
//     console.info(`forge enchantment registry ${forgeRegistryEnch}`)
//     const enchantmentMatchMaxLevel = forgeRegistryEnch.value.getMaxLevel()
//     console.info(`enchantmentMatchMaxLevel ${enchantmentMatchMaxLevel}`)

//     let upgradeMatchCopy = upgradeMatch.copy()

//     if (enchantmentMatchMaxLevel > upgradeMatchCopy?.lvl) {
//         upgradeMatchCopy.lvl += 1 // IS IT THIS? IT IS THIS. SOMEHOW ASSIGNING TO THIS
//         console.info(`level incriment ${upgradeMatchCopy?.lvl}`)
//     }

//     console.info(`upgrade match after operation ${upgradeMatchCopy}`)



//     // const upgradeMatchHasHigherLevel = upgradeMatchHasHigherLevel

//     return upgradeMatchCopy
// }

// const handleEnchantmentHighestLevelTransfer = (rightSideEnchant, leftSideEnchantmentsList) => {

// }



// ForgeEvents.onEvent('net.minecraftforge.event.AnvilUpdateEvent', (event) => {
//     const { left, right } = event
//     // console.info(`left right ${left} ${right}`)
//     let leftInputItemstack = left
//     let rightInputItemstack = right // getRight() is never returning anything // I think 

//     let modifiedInputItemNBTData = leftInputItemstack.nbt.copy()
//     let modifiedInputItemstack = leftInputItemstack.copy()

//     const leftSideEnchantmentsList = leftInputItemstack.getEnchantmentTags() // only reads enchantments from weapon / tool items
//     // let rightSideEnchantmentsList = rightInputItemstack.getNbtString() // only reads enchantments from books
//     let rightSideEnchantmentsList = rightInputItemstack.nbt // only reads enchantments from books



//     // console.info(`filteredEnchantsForItem ${typeof rightSideEnchantmentsList}`)
//     // // console.info(`filteredEnchantsForItem2 ${Object.keys(rightSideEnchantmentsList)}`)
//     // console.info(`filteredEnchantsForItem3 ${rightSideEnchantmentsList?.StoredEnchantments}`)
//     // console.info(`filteredEnchantsForItem3.5 ${rightSideEnchantmentsList?.StoredEnchantments?.length}`)
//     // console.info(`filteredEnchantsForItem4 ${rightSideEnchantmentsList}`)
//     // // console.info(`filteredEnchantsForItem4 ${rightSideEnchantmentsList?.getAllKeys()}`)



//     if (!(event.getPlayer().level === 'ClientLevel')) {
//         if ((leftInputItemstack.id === 'frontiers:fire_staff') && (rightInputItemstack.id === 'minecraft:enchanted_book')) {
//             // console.info(`working ${rightSideEnchantmentsList}`)
//             try {

//                 let newFireStaffItem = Item.of('frontiers:fire_staff')
//                 newFireStaffItem.nbt = modifiedInputItemNBTData

//                 newFireStaffItem.nbt.getAllKeys().forEach((key) => {
//                     console.info(`newFireStaffItem nbt ${key}`)
//                 })
//                 console.info(`newFireStaffItem nbt2 ${newFireStaffItem.nbt.StoredEnchantments}`)


//                 console.info(`new fire staff item ${newFireStaffItem}`)
//                 if (rightSideEnchantmentsList?.StoredEnchantments?.length) { // check if there are any enchantments on an enchanted book in the right side anvil slot
//                     let filteredAllowedEnchantsList = rightSideEnchantmentsList.StoredEnchantments.filter((rightSideEnchantment => {
//                         // console.info(`filtering right side enchantment ${rightSideEnchantment?.id}`)
//                         return allowedEnchantsForFireStaff.includes(rightSideEnchantment?.id)
//                     }))
//                     console.info(`filteredAllowedEnchantsList ${filteredAllowedEnchantsList}`)
//                     if (filteredAllowedEnchantsList.length) {
//                         // let modifiedInputItemstack = leftInputItemstack.enchant(filteredAllowedEnchantsList[0]?.id, filteredAllowedEnchantsList[0]?.lvl) // this works but the below doesn't?


//                         // let modifiedInputItemstack = new Internal.ItemStack(leftInputItemstack) // this works? NOPE
//                         // let modifiedInputItemstack = leftInputItemstack.copy()
//                         // console.info(`modifiedInputItemstack ${modifiedInputItemstack}`)

//                         filteredAllowedEnchantsList.forEach((enchantment) => {
//                             // check for upgrades here
//                             const upgradedEnchantment = handleEnchantmentUpgrade(enchantment, leftSideEnchantmentsList)
//                             console.info(`handleEnchantmentUpgrade response ${upgradedEnchantment}`)
//                             const newEnchantmentLevel = upgradedEnchantment?.lvl || enchantment?.lvl
//                             // modifiedInputItemstack = modifiedInputItemstack.enchant(enchantment?.id, newEnchantmentLevel)
//                             newFireStaffItem = newFireStaffItem.enchant(enchantment?.id, newEnchantmentLevel)
//                         })



//                         event.setOutput(newFireStaffItem) // for some reason this operation needs to happen before others
//                         // if (!left?.repairCost()) {
//                         //     left.setRepairCost(1)
//                         // }
//                         event.setCost(1)
//                         // event.setCost(1 + right.repairCost())
//                         event.setCanceled(false)
//                         event.setMaterialCost(1)
//                         console.info(`set output to: ${newFireStaffItem}`)

//                     }
//                 }
//             } catch (e) {
//                 console.info(`my error message: ${e}`)
//                 console.error(`my error message: ${e}`)
//             }
//             console.info(`isCanceled ${event.isCanceled()}`)


//             // const filteredEnchantsForItem = rightSideEnchantmentsList.filter((enchantment) => {
//             //     return allowedEnchantsForFireStaff.includes(enchantment?.id)
//             // })
//             // const filteredEnchantsForItem = rightSideEnchantmentsList.map(enchantment => {
//             //     return enchantment
//             // })

//         }
//     }


//     // getAllEnchantments() gives the java class reference for the enchant
//     // getEnchantmentTags() gives [{id:"minecraft:power",lvl:3s}]
//     // console.info(`left enchantments ${leftInputItemstack.getAllEnchantments()} ${leftInputItemstack.getEnchantmentTags()} ${leftInputItemstack.getTags()} 
//     // ${leftInputItemstack.getTypeData()} ${leftInputItemstack.getItem()} ${leftInputItemstack.weakNBT()} ${leftInputItemstack.getNbt()} 
//     // ${leftInputItemstack.hasNBT()} ${leftInputItemstack.strongNBT()} ${leftInputItemstack.getNbtString()}`)
//     // console.info(`right enchantments ${rightInputItemstack.getAllEnchantments()} ${rightInputItemstack.getEnchantmentTags()}`)

//     // console.info(`getOutput ${event.getOutput()}`)
//     // console.info(`getResult ${event.getResult()}`)

//     // getOutput -> modify it -> setOutput(itemstack)

//     // getOutput
//     // getResult
//     // setOutput

//     //   const { left, right } = event
//     //     try {
//     //       if (left.isEmpty() || right.isEmpty()) return
//     //       let rightEnchant = right.nbt
//     //       let leftEnchant = left.nbt
//     //       if (rightEnchant == leftEnchant) {
//     //         event.setCanceled(true)
//     //       }
//     //     }
//     //     catch (e) {
//     //       console.error(e)
//     //     }
// })



// recursive function that uses scheduleInTicks(1) every tick and runs events on some sort of breakpoint?

StartupEvents.registry("item", event => {
    event.create("frontiers:example_item", 'sword')
        .use((level, player, hand) => {
            // console.info(`temp ${hand}`)
            return true
        })
    // .transformObject(itemstack => {
    //     console.info(`createObject itemstack ${itemstack}`)

    //     return itemstack
    // })
    event.create("frontiers:fire_staff", 'sword')
        // .transformObject(itemstack => {
        //     console.info(`createObject itemstack ${itemstack}`)

        //     return itemstack
        // })
        // .tier('gold')
        // .attackDamageBaseline(1)


        // .attackDamageBonus(1)
        // .useAnimation('none')
        .use((level, player, hand) => {
            // play first charge sound
            // console.info(`Client / Server level ${level === 'ClientLevel'} ${level === 'ServerLevel'} ${level}`)
            // console.info(`play first audio ${level.getServer()} ${player.server}`)
            // hasCanceledCharge = false
            // // handleChargingTick()
            // runDelayedCodeOnItemCharge()

            // const isClientLevel = level === 'ClientLevel'
            // console.info(`client schedule in ticks ${Client.scheduleInTicks}`)

            // if (isClientLevel) {
            //     Client.scheduleInTicks(10, event => { // seems to require all vars in main method to be redeclarable
            //         console.info(`has canceled charge? ${hasCanceledCharge}`)
            //         if (!hasCanceledCharge) {
            //             level.playSound(player, player.block.pos, 'frontiers:loading_start', "players", 1, 1)

            //             console.info(`play second audio ${hasCanceledCharge}`)
            //             // second charge sound

            //         }

            //     });
            //     console.info(`!level === 'ClientLevel'`)
            //     Client.scheduleInTicks(20, event => { // seems to require all vars in main method to be redeclarable
            //         console.info(`has canceled charge? ${hasCanceledCharge}`)
            //         if (!hasCanceledCharge) {
            //             level.playSound(player, player.block.pos, 'frontiers:loading_middle1', "players", 1, 1)

            //             console.info(`play second audio ${hasCanceledCharge}`)
            //             // second charge sound

            //         }
            //     });
            // }

            // // 10 ticks in, check hasCanceledCharge
            // console.info(`running use`)


            if (!(level === 'ClientLevel')) {
                // console.info(`running animation on ${level}`)
                // console.info(`next fire staff swing animation ${nextFireStaffSwingAnimation}`)

                // player.triggerAnimation("animationjs:waving")
                if (nextFireStaffSwingAnimation === 8) {
                    // console.info(`playing animation 8`)
                    player.triggerAnimation("frontiers:firestaff_animation8")
                    nextFireStaffSwingAnimation = 9
                } else if (nextFireStaffSwingAnimation === 9) {
                    // console.info(`playing animation 9`)
                    player.triggerAnimation("frontiers:firestaff_animation9") // firestaff_animation9
                    nextFireStaffSwingAnimation = 10
                } else if (nextFireStaffSwingAnimation === 10) {
                    // console.info(`playing animation 10`)
                    player.triggerAnimation("frontiers:firestaff_animation10") // firestaff_animation10
                    nextFireStaffSwingAnimation = 8
                }

                // player.triggerAnimation("minecraft:spear")
            }
            return true
        })
        .maxDamage(382)
        .finishUsing((itemstack, level, entity) => {
            if (!entity.player) return itemstack
            console.info(`1tags itemstack ${itemstack.getEnchantmentTags()}`)
            console.info(`2tags itemstack ${itemstack.getEnchantments()}`)
            console.info(`3tags itemstack ${itemstack.isBookEnchantable(itemstack)}`)
            console.info(`4tags itemstack ${itemstack.isEnchanted()}`)
            console.info(`5tags itemstack ${itemstack.getAllEnchantments()}`)
            console.info(`6tags itemstack ${itemstack.isEnchantable()}`)
            console.info(`7isEnchantable ${Item.getItem("frontiers:fire_staff").isEnchantable(itemstack)}`)
            // isEnchantable(itemstack)
            // can probably hasEnchantment(enchant, level)
            // how to set allowed enchantments
            return global.finishUsingFireCrystal(itemstack, level, entity)
        })
        .releaseUsing((itemstack, level, player) => {

            if (!(level === 'ClientLevel')) {
                if (nextFireStaffSwingAnimation === 8) { // if 8, 10 must have been canceled. Re-queue 10
                    // console.info(`canceling animation 10`)
                    player.stopAnimation("frontiers:firestaff_animation10");
                    nextFireStaffSwingAnimation = 10
                } else if (nextFireStaffSwingAnimation === 9) { // if 9, 8 must have been canceled. Re-queue 8
                    // console.info(`canceling animation 8`)
                    player.stopAnimation("frontiers:firestaff_animation8");
                    nextFireStaffSwingAnimation = 8
                } else if (nextFireStaffSwingAnimation === 10) {
                    // console.info(`canceling animation 9`)

                    player.stopAnimation("frontiers:firestaff_animation9");
                    nextFireStaffSwingAnimation = 9
                }
                // player.stopAnimation("frontiers:firestaff_animation8");
                // player.stopAnimation("frontiers:firestaff_animation9");
                // player.stopAnimation("frontiers:firestaff_animation10");
                // need another animation here to gracefully cancel
            }

            // console.info(`event player release ${itemstack} ${level} ${player}`)
            // event.player.stopAnimation("frontiers:firestaff_animation4");
        })
        .useDuration(itemstack => 40)
    // .subtypes((itemstack) => {
    //     console.info(`runs on item registry`) // doesnt work

    //     return [itemstack]
    // })
})

StartupEvents.registry('entity_type', event => {
    event.create("frontiers:fireball1", "entityjs:geckolib_projectile").onHitEntity(context => {
        // 'entity' in this context is the projectile that is spawned
        // 'result.entity' in this context is the target that is hit by the projectile
        const { entity, result } = context;



        // event.server.scheduleInTicks(20, callback => { // this code runs 5 seconds later
        //     console.info('callback scheduled in ticks')
        // })
        // function callback() {
        //     //changes the scope of itemEntity (otherwise if used 2 times in a row within 5 seconds, problems would occur)
        //     event.server.scheduleInTicks(100, callback => { // this code runs 5 seconds later
        //         console.info('callback scheduled in ticks')
        //     })
        // }
        // callback()

        // The 'entity' (projectile) has a list of possible damage sources on it, accessed through damageSources()
        // to set the player as the source of damage, we choose .playerAttack() as the damage source,
        // which requires a reference to the player be passed to it.
        // This can be any player reference, in this case we're using entity.getOwner(), 
        // which is a value we set to be the player with this line in global.exampleFinishUsing below when spawning the projectile:
        // projectile.setOwner(player)
        const player = entity.getOwner()
        const damageSource = entity.damageSources().playerAttack(player)
        // console.info(`player level ${player.level}`)

        const world = player.level

        // console.info(`playerlevel ${world}`)

        const randomFireballCollisionSound = getRandomSound(fireballCollisionSounds, threeMostRecentFireCollisionSoundSelections)

        // console.info(`fire sound index ${randomFireballCollisionSound}`)


        world.playSound(entity, entity.block.pos, randomFireballCollisionSound, "players", 3, 1)

        // if (world === 'ClientLevel') {


        // }

        const collisionX = result.entity.x
        const collisionY = result.entity.y
        const collisionZ = result.entity.z

        // world.spawnParticles("explosiveenhancement:blank_fireball", false, collisionX, collisionY + 1, collisionZ, 1, 1, 1, 15, 0) // clean up magic numbers
        // world.spawnParticles("explosiveenhancement:blank_shockwave", false, collisionX, collisionY + 1, collisionZ, 1, 1, 1, 15, 0) // clean up magic numbers
        // world.spawnParticles("explosiveenhancement:blastwave", false, collisionX, collisionY + 1, collisionZ, 1, 1, 1, 15, 0) // clean up magic numbers
        // world.spawnParticles("explosiveenhancement:fireball", false, collisionX, collisionY + 1, collisionZ, 1, 1, 1, 15, 0) // clean up magic numbers
        // world.spawnParticles("explosiveenhancement:shockwave", false, collisionX, collisionY + 1, collisionZ, 1, 1, 1, 15, 0) // clean up magic numbers
        // world.spawnParticles("explosiveenhancement:blank_fireball", false, collisionX, collisionY + 1, collisionZ, 1, 1, 1, 3, 1) // some of the particles from explosive enhancements require speed of 1 in order to display
        world.spawnParticles("explosiveenhancement:fireball", false, collisionX, collisionY + 1, collisionZ, 1, 1, 1, 7, 1) // some of the particles from explosive enhancements require speed of 1 in order to display
        world.spawnParticles("explosiveenhancement:smoke", false, collisionX, collisionY + 1, collisionZ, 1, 1, 1, 10, 0.1) // some of the particles from explosive enhancements require speed of 1 in order to display
        world.spawnParticles("explosiveenhancement:blastwave", false, collisionX, collisionY + 1, collisionZ, 1, 1, 1, 3, 1) // some of the particles from explosive enhancements require speed of 1 in order to display

        // now we pass the damage source as the first param to result.entity.attack()
        // if your projectile isn't dealing any damage when you pass this param, you're probably passing an invalid damage source
        // check your startup console for errors
        // result.entity.attack(damageSource, 2) // this wont be here. base projectile should deal no damage
        // spawnFrostShard(player, player.level, result.entity.eyePosition, player.lookAngle, 1, 0)
        // spawnFrostShard(player, player.level, result.entity.eyePosition, player.lookAngle, 0, 1)

        // we now get rid of the projectile entity
        entity.kill()

        // console.info(`xPlusTen ${result.entity.x + 10}`)
        // console.info(`xMinusTen ${result.entity.x - 10}`)

        const RADIUS = 3

        const hitEntity = result.entity

        const { xsize, ysize, zsize } = hitEntity.boundingBox

        const nearbyEntities = hitEntity.level.getEntitiesWithin(hitEntity.boundingBox.deflate(xsize, ysize, zsize).inflate(RADIUS)).filter(entity => entity.living)

        nearbyEntities.forEach((nearbyEntity) => {
            nearbyEntity.setRemainingFireTicks(100)
            nearbyEntity.attack(damageSource, FIRESTAFF_BASE_DAMAGE)

            // console.info(`nearbyEntityKeys ${Object.keys(nearbyEntity)}`)
        })
        // console.info(`endermen ${nearbyEntities}`)
        // const nearbyEntities = result.entity.getLevel().getEntitiesWithin([result.entity.x + 10, result.entity.y + 10, result.entity.z + 10, result.entity.x - 10, result.entity.y - 10, result.entity.z - 10])
        // console.info(`nearby entities ${nearbyEntities}`)


    }).onHitBlock(context => {
        const { entity } = context

        const player = entity.getOwner()
        const damageSource = entity.damageSources().playerAttack(player)
        const world = player.level

        // console.info(`playerlevel onHitBlock ${world}`)

        const randomFireballBlockCollisionSound = getRandomSound(fireballCollisionSounds, threeMostRecentFireCollisionSoundSelections)

        // console.info(`fire sound index onHitBlock ${randomFireballBlockCollisionSound}`)


        world.playSound(entity, entity.block.pos, randomFireballBlockCollisionSound, "players", 3, 1)

        // if (world === 'ClientLevel') {


        // }

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
        // console.info(`hit block ${nearbyEntities}`)

        entity.kill()
    }).tick(entity => {
        const world = entity.level

        const collisionX = entity.x
        const collisionY = entity.y
        const collisionZ = entity.z

        // console.info(`entity lifespan ${Object.keys(entity)}`)
        // console.info(`entity lifespan ${entity.age}`)

        if (entity.age === 3) {
            world.playSound(entity, entity.block.pos, 'frontiers:fire_projectile_whoosh5', "players", 1, 1)

        }

        world.spawnParticles("minecraft:smoke", false, collisionX, collisionY + 0.3, collisionZ, 0, 0, 0, 1, 0) // clean up magic numbers
        world.spawnParticles("minecraft:lava", false, collisionX, collisionY, collisionZ, 0, 0, 0, 1, 20) // clean up magic numbers
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

    // console.info(`level ${level}`)
    // console.info(`level keys ${Object.keys(level)}`)
    // fireballSlowdownCallback(projectile, level)
}

global.finishUsingFireCrystal = (/**@type {Internal.ItemStack}*/itemstack, /**@type {Internal.Level}*/level, /**@type {Internal.Player}*/player) => {
    const { usedItemHand, inventory, lookAngle, eyePosition } = player

    player.addItemCooldown(itemstack.item, 0) // itemcooldown 0 is perfect for gat mode
    player.damageHeldItem(usedItemHand, 1)

    const NBTData = itemstack
    console.info(`Itemstack keys ${Object.keys(NBTData)}`)

    // level.playSound(player, player.block.pos, 'frontiers:fire_projectile_whoosh3', "players", 1, 1)

    spawnFireball(player, level, eyePosition, lookAngle)

    return itemstack
}


// ForgeEvents.onEvent('net.minecraftforge.event.AnvilUpdateEvent', (event) => {
//     try {
//         let { left, right, name, cost, player } = event

//         if (!(event.getPlayer().level === 'ClientLevel')) {
//                 let anvilMenuData = global.anvilMenuRef
//                 let getOutputItem = anvilMenuData.getInventoryContainer().getSlot(2).getItem()
//         }

//     } catch (err) {
//         console.error(`my error; ${err}`)
//     }

// })
