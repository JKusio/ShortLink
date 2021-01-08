const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const UserCredentials = new Schema({
    password: {
        type: String,
        required: true,
        match: [/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,24}$/, 'Password not correct!']
    },
    passwordSalt: {
        type: String
    },
    email: {
        type: String,
        unique: true,
        required: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Email not correct!']
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
        match: [/^[0-9a-zA-Z_.-]{5,16}/, 'Username not correct!'],
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
    links: {
        type: [String],
        default: []
    }
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