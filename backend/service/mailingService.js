const nodemailer = require('nodemailer');

class MailingService {
    constructor(mailHost, mailPort, mailAddress, mailPassword) {
        const isSecure = mailPort === 465;

        this.transporter = nodemailer.createTransport({
            host: mailHost,
            port: mailPort,
            secure: isSecure,
            auth: {
                user: mailAddress,
                pass: mailPassword
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

        await this.transporter.sendMail(message);
    }
}

module.exports = MailingService;
