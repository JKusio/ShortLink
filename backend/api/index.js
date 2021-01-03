const route = require('express').Router();
const user = require('./routes/user');

module.exports = () => {
    const app = route;
    user(app);

    return app;
};