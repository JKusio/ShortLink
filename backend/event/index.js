const EventEmitter = require('events');
const eventTypes = require('./eventTypes');
const userEvents = require('./userEvents');
const linkEvents = require('./linkEvents');

class Events extends EventEmitter {
    constructor() {
        super();    
        userEvents(this);
        linkEvents(this);
    }

    get eventTypes() {
        return eventTypes;
    }
}

module.exports = new Events();