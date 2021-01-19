const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const express = require('express');
const routes = require('../api');
const config = require('../config');
const { container } = require('./container');
const errorHandler = require('../error');

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

    // add routes to app
    app.use(config.api.prefix, routes());

    // express was request /favicon.ico as /:id
    app.get('/favicon.ico', (req, res) => { 
        res.sendStatus(204); 
    });

    // LINK - redirect to correct url
    app.get('/:id', async (req, res, next) => {
        const referer = req.header('Referer');
        const language = req.headers['accept-language'];
        const linkCode = req.params.id

        const linkService = container.resolve('linkService');
        const events = container.resolve('eventHandler');

        try {
            const originalURL = await linkService.getOriginalURL(linkCode);
            events.emit(events.eventTypes.link.redirect, {referer, language, linkCode});
            res.redirect(originalURL);
        } catch (err) {
            next(err);
        }
    });

    // catch 404
    app.use((req, res, next) => {

        const err = errorHandler.createBaseError(errorHandler.errorTypes.otherErrors.notFound, errorHandler.httpStatusCodes.NOT_FOUND, true);
        next(err);
    });

    // handle base errors
    app.use((err, req, res, next) => {
        if (errorHandler.isTrustedError(err)) {
            return res.status(err.statusCode)
                .json({ errors: err.errorTypes }).end();
        }
        return next(err);
    });

    // handle all other errors
    app.use((err, req, res) => {
        res.status(500);
        res.json({
            errors: {
                message: err.message
            }
        })
    });
};