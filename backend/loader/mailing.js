const mailingService = require('../services/mailingService');
const config = require('../config');

module.exports = () => {
    const { smtp, port, address, password }  = config.mail;
    mailingService.setTransporter(smtp, port, address, password);
}