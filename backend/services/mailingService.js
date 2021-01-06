const nodemailer = require('nodemailer');

class MailingService {
    setTransporter(host, port, address, password) {
        const isSecure = port === 465;

        this.transporter = nodemailer.createTransport({
            host: host,
            port: port,
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

        try {
            await this.transporter.sendMail(message);
        } catch(err) {
            throw err;
        }
    }
}

module.exports = new MailingService();