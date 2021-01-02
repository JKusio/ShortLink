const mongooseLoader = require('./mongoose');
const expressLoader = require('./express');
const passportLoader = require('./passport');

module.exports = async (app, passport) => {
    await mongooseLoader();
    console.log('DB loaded and connected!');

    await expressLoader(app, passport);
    console.log('Express loaded!');

    await passportLoader(passport);
    console.log('Passport loaded!');
}