const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Link = new Schema({
    code: {
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
        default: Date.now
    },
    expirationDate: {
        type: Date
    },
    userID: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
});

Link.pre('save', async function(next) {
    if (this.isModified('expirationDate')) return next();

    const expirationDate = this.creationDate;
    expirationDate.setDate(expirationDate.getDate() + 7);
    this.expirationDate = expirationDate;
    next();
});

module.exports = mongoose.model('Link', Link);