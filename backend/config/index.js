require('dotenv/config');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

module.exports = {
    databseURL: process.env.MONGODB_URI,
    port: parseInt(process.env.PORT, 10),
    api: {
        prefix: '/api'
    },
    sessionSecret: process.env.SESSION_SECRET,
    mail: {
        address: process.env.EMAIL_ADDRESS,
        password: process.env.EMAIL_PASSWORD,
        smtp: process.env.SMTP_ADDRESS,
        port: parseInt(process.env.SMTP_PORT, 10)
    },
    logs: {
        level: process.env.LOG_LEVEL || 'silly',
    }
}