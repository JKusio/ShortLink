const bodyParser = require('body-parser');
const cors = require('cors');
const routes = require('../api');
const config = require('../config');
const passport = require('passport');
const session = require('express-session');

module.exports = (app) => {
    // passport initialization
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

    // catch 404
    app.use((req, res, next) => {
        const err = new Error('Not found');
        err['status'] = 404;
        next(err);
    });

    // error handler
    app.use((err, req, res, next) => {
        if (err.name === 'UnauthorizedError') {
            return res.status(err.status)
                .send({ message: err.message })
                .end();
        }
        return next(err);
    });

    app.use((err, req, res, next) => {
        res.status(err.status || 500);
        res.json({
            errors: {
                message: err.message
            }
        })
    });
};