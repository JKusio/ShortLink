const mongoose = require('mongoose');

const User = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        minlength: 5,
        maxlength: 24,
        index: true
    },
    lastLogin: {
        type: Date,
        default: Date.now
    },
    creationDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.Model('User', User);