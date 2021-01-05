const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LinksCounter = new Schema({
    currentID: { 
        type: Number,
        required: true
    }
}, { collection: 'linkscounter'});

module.exports = mongoose.model('LinksCounter', LinksCounter);