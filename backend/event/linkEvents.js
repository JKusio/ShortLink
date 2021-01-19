module.exports = (eventEmitter, statisticService) => {

    eventEmitter.on(eventEmitter.eventTypes.link.redirect, async (redirectData) => {
        await statisticService.createStatistic(redirectData.referer, redirectData.language, redirectData.linkCode);
    });
}