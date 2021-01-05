const nodemailer = require('nodemailer');
const config = require('../config');

class MailingService {
    constructor() {
        const mail = config.mail;
        const isSecure = mail.port === 465;

        this.transporter = nodemailer.createTransport({
            host: mail.smtp,
            port: mail.port,
            secure: isSecure,
            auth: {
                user: mail.address,
                pass: mail.password
            }
        });
    }

    async sendMail(address, subject, html) {
        const message = {
            from: this.transporter.options.auth.user,
            to: address,
            subject,
            html
        };

        try {
            await this.transporter.sendMail(message);
        } catch(err) {
            throw err;
        }
    }
}

module.exports = new MailingService();