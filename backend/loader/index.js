const mongooseLoader = require('./mongoose');
const expressLoader = require('./express');
const passportLoader = require('./passport');
const linksCounter = require('./linksCounter');

module.exports = async (app) => {
    await mongooseLoader();
    console.log('DB loaded and connected!');

    await passportLoader();
    console.log('Passport loaded!');

    await expressLoader(app);
    console.log('Express loaded!');

    await linksCounter();
    console.log('Links counter initalized!');
}