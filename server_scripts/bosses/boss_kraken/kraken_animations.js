const stopAllAnimations = (entity) => {
    entity.stopTriggeredAnimation('krakenBossController', 'k_idle')
    entity.stopTriggeredAnimation('krakenBossController', 'k_attack')
}