const route = require('express').Router();
const user = require('./routes/user');
const link = require('./routes/link');

module.exports = () => {
    const app = route;
    user(app);
    link(app);

    return app;
};