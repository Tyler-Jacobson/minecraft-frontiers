
let nextFireStaffSwingAnimation = 'fire_staff_swing_left' // multiplayer


const playFireStaffSwingAnimation = (level, player) => {
    if (!(level === 'ClientLevel')) { // move to animations
        if (nextFireStaffSwingAnimation === 'fire_staff_swing_left') {
            // player.triggerAnimation("frontiers:fire_staff_swing_left")
            try {
                player.triggerAnimation("frontiers:fire_staff_swing_left", 1, "linear", true, true)
                nextFireStaffSwingAnimation = 'fire_staff_swing_right'
            } catch (err) {
                console.error(`failed to play fire staff animation: ${err}`)
            }

        } else if (nextFireStaffSwingAnimation === 'fire_staff_swing_right') {
            try {
                player.triggerAnimation("frontiers:fire_staff_swing_right", 1, "linear", true, true)
                nextFireStaffSwingAnimation = 'fire_staff_swing_center'
            } catch (err) {
                console.error(`failed to play fire staff animation: ${err}`)
            }

        } else if (nextFireStaffSwingAnimation === 'fire_staff_swing_center') {
            try {
                player.triggerAnimation("frontiers:fire_staff_swing_center", 1, "linear", true, true)
                nextFireStaffSwingAnimation = 'fire_staff_swing_left'
            } catch (err) {
                console.error(`failed to play fire staff animation: ${err}`)
            }
        }
    }
}

const cancelFireStaffSwingAnimation = (level, player) => {
    if (!(level === 'ClientLevel')) {
        if (nextFireStaffSwingAnimation === 'fire_staff_swing_left') { // if 'fire_staff_swing_left', 'fire_staff_swing_center' must have been canceled. Re-queue 'fire_staff_swing_center'
            player.stopAnimation("frontiers:fire_staff_swing_center");
            nextFireStaffSwingAnimation = 'fire_staff_swing_center'
        } else if (nextFireStaffSwingAnimation === 'fire_staff_swing_right') { // if 'fire_staff_swing_right', 'fire_staff_swing_left' must have been canceled. Re-queue 'fire_staff_swing_left'
            player.stopAnimation("frontiers:fire_staff_swing_left");
            nextFireStaffSwingAnimation = 'fire_staff_swing_left'
        } else if (nextFireStaffSwingAnimation === 'fire_staff_swing_center') {
            player.stopAnimation("frontiers:fire_staff_swing_right");
            nextFireStaffSwingAnimation = 'fire_staff_swing_right'
        }
    }
}

