const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const UserCredentials = new Schema({
    userID: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
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
        required: true
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

module.exports = mongoose.model('UserCredentials', UserCredentials);