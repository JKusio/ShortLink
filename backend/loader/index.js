const { containerSetup } = require('./container');
const mongooseLoader = require('./mongoose');
const expressLoader = require('./express');
const passportLoader = require('./passport');
const linksCounterLoader = require('./linksCounter');
const Logger = require('./logger');

module.exports = async (app) => {
    containerSetup();
    Logger.info('Container created!');

    await mongooseLoader();
    Logger.info('DB loaded and connected!');

    await passportLoader();
    Logger.info('Passport loaded!');

    await expressLoader(app);
    Logger.info('Express loaded!');

    await linksCounterLoader();
    Logger.info('Links counter initalized!');
};
