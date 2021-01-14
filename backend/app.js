const express = require('express');
const config = require('./config');
const loader = require('./loader');
const Logger = require('./loader/logger');

(async () => {
    const app = express();

    await loader(app);

    app.listen(config.port, () => {
        Logger.info(`Server listening on port: ${config.port}`);
    }).on('error', err => {
        Logger.error(err);
        process.exit(1);
    });
})();