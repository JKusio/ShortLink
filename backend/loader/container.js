const awilix = require('awilix');
// MODELS
const EmailVerificationModel = require('../model/emailVerification');
const LinkModel = require('../model/link');
const LinksCounterModel = require('../model/linksCounter');
const StatisticModel = require('../model/statistic');
const UserModel = require('../model/user');
// SERVICES
const linkService = require('../service/linkService');
const mailingService = require('../service/mailingService');
const statisticService = require('../service/statisticService');
const userService = require('../service/userService');
// EVENTS
const eventHandler = require('../event');
// OPTIONS
const config = require('../config');

const container = awilix.createContainer({
    injectionMode: awilix.InjectionMode.CLASSIC
});

function containerSetup() {
    // MODELS
    container.register({
        EmailVerificationModel: awilix.asValue(EmailVerificationModel),
        LinkModel: awilix.asValue(LinkModel),
        LinksCounterModel: awilix.asValue(LinksCounterModel),
        StatisticModel: awilix.asValue(StatisticModel),
        UserModel: awilix.asValue(UserModel)
    });

    // SERVICES
    container.register({
        linkService: awilix.asClass(linkService),
        mailingService: awilix.asClass(mailingService),
        statisticService: awilix.asClass(statisticService),
        userService: awilix.asClass(userService)
    });

    // EVENT HANDLER
    container.register({
        eventHandler: awilix.asClass(eventHandler, { lifetime: awilix.Lifetime.SINGLETON })
    });

    // VALUES
    container.register({
        mailHost: awilix.asValue(config.mail.smtp), 
        mailPort: awilix.asValue(config.mail.port), 
        mailAddress: awilix.asValue(config.mail.address), 
        mailPassword: awilix.asValue(config.mail.password)
    });
}

module.exports = {
    container,
    containerSetup
}