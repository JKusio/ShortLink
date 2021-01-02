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
        default: null
    },
    creationDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', User);