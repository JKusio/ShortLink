const statisticService = require('../services/statisticService');
const eventTypes = require('./eventTypes');

module.exports = (eventEmitter) => {
    eventEmitter.on(eventTypes.link.redirect, async (redirectData) => {
        await statisticService.createStatistic(redirectData.referer, redirectData.language, redirectData.linkCode);
    });
}