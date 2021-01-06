const LinksCounter = require('../model/linksCounter');

/**
 * There is no auto increment id in mongodb, and the custom id that mongodb generates is not something we need.
 * There will be one LinksCounter object that will hold the biggest id ever generated.
 * We need that because the short code is generated from id number.
 */
module.exports = async () => {
    let linksCounter = await LinksCounter.findOne();

    // Create one and only link counter if there is none
    if (!linksCounter) {
        /**
         * We start from 4096 because we want codes that are at least 3 letters long! (1 * 64 * 64) = 4096
         */
        await LinksCounter.create({currentID: 4096});
    }
};