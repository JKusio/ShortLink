const EventEmitter = require('events');
const eventTypes = require('./eventTypes');
const userEvents = require('./userEvents');

class Events extends EventEmitter {
    constructor() {
        super();    
        userEvents(this);
    }

    get eventTypes() {
        return eventTypes;
    }
}

module.exports = new Events();