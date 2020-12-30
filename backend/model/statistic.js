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
    hash: {
        type: Schema.Types.ObjectId,
        ref: 'Link',
        required: true
    },
});

module.exports = mongoose.Model('Statistic', Statistic);