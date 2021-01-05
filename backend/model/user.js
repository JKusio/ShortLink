const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const UserCredentials = new Schema({
    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 32
    },
    passwordSalt: {
        type: String
    },
    email: {
        type: String,
        unique: true,
        required: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'aaa']
    },
    emailVerified: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    }
}, {_id: false});

const User = new Schema({
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
    },
    credentials: UserCredentials,
    link: ['Links']
});

// we can't use arrow functions here because there is no "this" binding in it
// we will hash password in this middleware
UserCredentials.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.password, salt);
        this.passwordSalt = salt;
        this.password = hashedPassword;
        next();
    } catch (err) {
        next(err);
    }
});

module.exports = mongoose.model('User', User);