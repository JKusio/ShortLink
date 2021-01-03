const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EmailVerification = new Schema({
    userID: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    token: {
        type: String,
        required: true
    },
    creationDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('EmailVerification', EmailVerification);