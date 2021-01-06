const mailingService = require('../services/mailingService');
const config = require('../config');

module.exports = () => {
    const mail = config.mail;
    mailingService.setTransporter(mail.smtp, mail.port, mail.address, mail.password);
}