const dotenv = require('dotenv');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const env = dotenv.config();

if (env.error) {
    throw new Error('Could not find .env file!');
} else {
    console.log('Loaded configuration from .env file!');
}

module.exports = {
    databseURL: process.env.MONGODB_URI,
    port: parseInt(process.env.PORT, 10),
    api: {
        prefix: '/api'
    },
    sessionSecret: process.env.SESSION_SECRET
}