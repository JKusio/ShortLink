const EventEmitter = require('events');
const userEvents = require('./userEvents');
const linkEvents = require('./linkEvents');

class Events extends EventEmitter {
    constructor() {
        super();    
        userEvents(this);
        linkEvents(this);
    }
}

module.exports = new Events();