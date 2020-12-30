const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserCredentials = new Schema({
    userID: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    password: {
        type: String,
        required: true
    },
    passwordSalt: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'user']
    }
});

module.exports = mongoose.Model('UserCredentials', UserCredentials);