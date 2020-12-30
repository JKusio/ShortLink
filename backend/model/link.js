const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Link = new Schema({
    hash: {
        type: String,
        required: true,
        unique: true
    },
    originalURL: {
        type: String,
        required: true
    },
    creationDate: {
        type: Date,
        required: true
    },
    expirationDate: {
        type: Date,
        required: true
    },
    userID: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
});

module.exports = mongoose.Model('Link', Link);