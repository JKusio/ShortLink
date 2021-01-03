const express = require('express');
const config = require('./config');
const loader = require('./loader');
const MailingService = require('./services/mailingService');

(async () => {
    const app = express();

    await loader(app);

    // const mailingService = new MailingService();
    // mailingService.sendMail('jakubkusiowski@gmail.com', 'Herro word!', '<h1> ! </h1>');

    app.listen(config.port, () => {
        console.log(`Server listening on port: ${config.port}`);
    }).on('error', err => {
        console.error(err);
        process.exit(1);
    });
})();