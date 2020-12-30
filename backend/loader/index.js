const mongooseLoader = require('./mongoose');

async function loader(app) {
    try {
        await mongooseLoader();
        console.log('DB loaded and connected!');

        console.log('')
    } catch (error) {
        console.error(error);
    }
}

module.exports = loader;