const runIdle = (entity) => {
    let actionDuration = 100 // how long will the action take (in ticks)
    entity.persistentData.startNextActionAge = entity.age + actionDuration // set persistent data to run new action after this one finishes
    entity.persistentData.putBoolean('lastActionWasIdle', true) // set persistent data to know that our last action was 'idle'
    entity.triggerAnimation('krakenBossController', 'k_idle') // play animations
    entity.persistentData.actionQueue = [] // clear the action queue
    // movement function here
}