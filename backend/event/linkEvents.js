const statisticService = require('../services/statisticService');

module.exports = (eventEmitter) => {
    eventEmitter.on(eventEmitter.eventTypes.link.redirect, async (redirectData) => {
        await statisticService.createStatistic(redirectData.referer, redirectData.language, redirectData.linkCode);
    });
}