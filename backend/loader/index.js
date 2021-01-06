const mongooseLoader = require('./mongoose');
const expressLoader = require('./express');
const passportLoader = require('./passport');
const linksCounterLoader = require('./linksCounter');
const mailingLoader = require('./mailing');

module.exports = async (app) => {
    await mongooseLoader();
    console.log('DB loaded and connected!');

    await passportLoader();
    console.log('Passport loaded!');

    await expressLoader(app);
    console.log('Express loaded!');

    await linksCounterLoader();
    console.log('Links counter initalized!');

    mailingLoader();
    console.log('Maling service loaded!');
}