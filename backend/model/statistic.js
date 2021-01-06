const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Statistic = new Schema({
    country: {
        type: String,
        required: true
    },
    accessTime: {
        type: Date,
        required: true
    },
    referral: {
        type: String
    },
    linkCode: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Statistic', Statistic);