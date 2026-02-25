let EnumSet = Java.loadClass("java.util.EnumSet")


const registerCustomGoalFlag = (event, goalName, goalFlag) => {
    try {
        let entityCurrentGoals = event.entity.goalSelector.getAvailableGoals()
        let goalToRegisterFlagFor = entityCurrentGoals.find(goalSelector => {
            return goalSelector.getGoal().toString() === goalName
        })
        if (!goalToRegisterFlagFor) {
            console.error(`could not find goal '${goalName}' to assign flag ${goalFlag}`)
            return
        }
        let currentFlags = goalToRegisterFlagFor.getGoal().getFlags()
        if (!currentFlags) {
            goalToRegisterFlagFor.setFlags(EnumSet.of(goalFlag))
            return
        }
        // I'm not sure that you're supposed to accumulate flags like this, but GPT suggested it. 
        // It works for the zombie crow because that mob doesn't use goal flags to drive behavior. 
        // If other mobs break, revert this
        currentFlags.add(goalFlag)
        goalToRegisterFlagFor.setFlags(currentFlags)
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