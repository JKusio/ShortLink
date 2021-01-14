const nodemailer = require('nodemailer');

class MailingService {
    setTransporter(host, port, address, password) {
        const isSecure = port === 465;

        this.transporter = nodemailer.createTransport({
            host,
            port,
            secure: isSecure,
            auth: {
                user: address,
                pass: password
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

module.exports = new MailingService();