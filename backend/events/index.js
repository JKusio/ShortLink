const EventEmitter = require('events');
const MailingService = require('../services/mailingService');
const eventTypes = require('./eventTypes');
const userEvents = require('./userEvents');

class Events extends EventEmitter {
    constructor() {
        super();    
        this.mailingService = new MailingService();
        userEvents(this, this.mailingService);
    }

    get eventTypes() {
        return eventTypes;
    }
}

module.exports = new Events();