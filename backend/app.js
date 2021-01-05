const express = require('express');
const config = require('./config');
const loader = require('./loader');

(async () => {
    const app = express();

    await loader(app);

    app.listen(config.port, () => {
        console.log(`Server listening on port: ${config.port}`);
    }).on('error', err => {
        console.error(err);
        process.exit(1);
    });
})();