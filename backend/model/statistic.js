const mongoose = require('mongoose');

const { Schema }  = mongoose;

const Statistic = new Schema({
    accessTime: {
        type: Date,
        default: Date.now
    },
    referer: {
        type: String
    },
    language: {
        type: String
    },
    linkCode: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Statistic', Statistic);