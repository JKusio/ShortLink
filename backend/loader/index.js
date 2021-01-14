const mongooseLoader = require('./mongoose');
const expressLoader = require('./express');
const passportLoader = require('./passport');
const linksCounterLoader = require('./linksCounter');
const mailingLoader = require('./mailing');
const Logger = require('./logger');

module.exports = async (app) => {
    await mongooseLoader();
    Logger.info('DB loaded and connected!');

    await passportLoader();
    Logger.info('Passport loaded!');

    await expressLoader(app);
    Logger.info('Express loaded!');

    await linksCounterLoader();
    Logger.info('Links counter initalized!');

    mailingLoader();
    Logger.info('Maling service loaded!');
}