const bodyParser = require('body-parser');
const cors = require('cors');
const routes = require('../api');
const config = require('../config');
const passport = require('passport');
const session = require('express-session');
const express = require('express');
// Error handling
const BaseError = require('../errors/baseError');
const errorTypes = require('../errors/errorTypes');
const httpStatusCodes = require('../errors/httpStatusCodes');
const errorHandler = require('../errors/errorHandler');

module.exports = (app) => {
    app.use(express.urlencoded({ extended: false }))
    app.use(session({
        secret: config.sessionSecret,
        resave: false,
        saveUninitialized: false
    }));
    app.use(passport.initialize());
    app.use(passport.session());

    app.get('/status', (req, res) => {
        res.status(200).end();
    });
    // head is similar to GET but without the resposne body
    app.head('/status', (req, res) => {
        res.status(200).end();
    });

    // app would work without this, but in some services we wouldn't be able to see the correct ip
    app.enable('trust proxy');

    // enable corss origin resource sharing!
    app.use(cors());

    // convert req.body to json
    app.use(bodyParser.json());

    // LINK - redirect to correct url
    app.get('/:id', (req, res, next) => {
        res.send('baka');
    });

    // add routes to app
    app.use(config.api.prefix, routes());

    // catch 404
    app.use((req, res, next) => {
        const err = new BaseError(errorTypes.otherErrors.notFound, httpStatusCodes.NOT_FOUND, true);
        next(err);
    });

    // handle base errors
    app.use((err, req, res, next) => {
        if (errorHandler.isTrustedError(err)) {
            return res.status(err.statusCode)
            .json({ errors: JSON.parse(err.message) })
            .end();
        }
        next(err);
    });

    // handle all other errors
    app.use((err, req, res, next) => {
        res.status(500);
        res.json({
            errors: {
                message: err.message
            }
        })
    });
};