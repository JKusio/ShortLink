const route = require('express').Router();
const user = require('./routes/user');

module.exports = (passport) => {
    const app = route;
    user(app, passport);

    return app;
};