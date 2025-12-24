const stopAllAnimations = (entity) => {
    entity.stopTriggeredAnimation('krakenBossController', 'k_idle')
    entity.stopTriggeredAnimation('krakenBossController', 'k_red_laser')
    entity.stopTriggeredAnimation('krakenBossController', 'k_yellow_laser')
    entity.stopTriggeredAnimation('krakenBossController', 'k_blue_laser')
}