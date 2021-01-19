/* eslint-disable class-methods-use-this */
const EventEmitter = require('events');
const userEvents = require('./userEvents');
const linkEvents = require('./linkEvents');
const eventTypes = require('./eventTypes');

class EventHandler extends EventEmitter {
    constructor(statisticService, mailingService, UserModel) {
        super();
        userEvents(this, mailingService, UserModel);
        linkEvents(this, statisticService);
    }

    get eventTypes() {
        return eventTypes;
    }
}


module.exports = EventHandler;