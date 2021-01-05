const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Link = new Schema({
    code: {
        type: String,
        required: true
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
        type: Date,
        /**
         * Default expiration date is one week from creation date
         */
        default: (() => {
            const expirationDate = new Date();
            expirationDate.setDate(expirationDate.getDate() + 7);
            return expirationDate;
        })()
    },
    userID: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
});

module.exports = mongoose.model('Link', Link);