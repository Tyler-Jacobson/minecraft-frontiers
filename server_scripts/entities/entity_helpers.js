let EnumSet = Java.loadClass("java.util.EnumSet")


const registerCustomGoalFlag = (event, goalName, goalFlag) => {
    try {
        let entityCurrentGoals = event.entity.goalSelector.getAvailableGoals()
        let goalToRegisterFlagFor = entityCurrentGoals.find(goalSelector => {
            return goalSelector.getGoal().toString() === goalName
        })
        goalToRegisterFlagFor.setFlags(EnumSet.of(goalFlag))
    } catch (err) {
        console.error(`error setting custom goal flag of ${goalFlag} for goal: ${goalName} with error: ${err}`)
    }
}

const logRegisteredGoals = (event) => {
    const entityCurrentGoals = event.entity.goalSelector.getAvailableGoals()
    entityCurrentGoals.forEach((goalSelector) => {
        console.log(`registered ${goalSelector.getGoal().toString()} with flags ${goalSelector.getGoal().getFlags()}`)
    })
}