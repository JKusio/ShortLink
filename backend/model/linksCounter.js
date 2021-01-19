const mongoose = require('mongoose');

const { Schema }  = mongoose;

const LinksCounter = new Schema({
    currentID: { 
        type: Number,
        required: true,
        default: 0
    }
}, { collection: 'linkscounter'});

module.exports = mongoose.model('LinksCounter', LinksCounter);