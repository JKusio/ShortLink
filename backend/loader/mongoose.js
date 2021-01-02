const mongoose = require('mongoose');
const config = require('../config');

module.exports = () => {
    return mongoose.connect(config.databseURL, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
} 