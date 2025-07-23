
let nextFireStaffSwingAnimation = 'fire_staff_swing_left' // multiplayer


const playFireStaffSwingAnimation = (level, player) => {
    if (!(level === 'ClientLevel')) { // move to animations
        if (nextFireStaffSwingAnimation === 'fire_staff_swing_left') {
            player.triggerAnimation("frontiers:fire_staff_swing_left")
            nextFireStaffSwingAnimation = 'fire_staff_swing_right'
        } else if (nextFireStaffSwingAnimation === 'fire_staff_swing_right') {
            player.triggerAnimation("frontiers:fire_staff_swing_right")
            nextFireStaffSwingAnimation = 'fire_staff_swing_center'
        } else if (nextFireStaffSwingAnimation === 'fire_staff_swing_center') {
            player.triggerAnimation("frontiers:fire_staff_swing_center")
            nextFireStaffSwingAnimation = 'fire_staff_swing_left'
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

