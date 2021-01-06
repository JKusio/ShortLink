const route = require('express').Router();
const userService = require('../../services/userService');
const middleware = require('./middleware');
const passport = require('passport');
const events = require('../../events');
const BaseError = require('../../errors/baseError');
const errorTypes = require('../../errors/errorTypes');

module.exports = (app) => {
    app.use('/users', route);

    // register
    route.post('/register', async (req, res, next) => {
        try {
            await userService.registerUser(req.body.name, req.body.email, req.body.password);
            // when user is created we will be only sending an 200 OK response, because all the created data is private (like id, hashed password etc.)
            res.sendStatus(200);
        } catch (err) {
            next(err);
        }
    });

    // verify token sent to email
    route.get('/verify/:token', async (req, res, next) => {
        try {
            await userService.verifyUser(req.params.token);
        } catch (err) {
            next(err);
        }
    });

    // login
    route.get('/login', (req, res, next) => {
        passport.authenticate('local', (err, user, info) => {
            if (err) return next(err); 

            req.logIn(user, (err) => {
                if (err) return next(err);
                events.emit(events.eventTypes.user.login, user._id);
                return res.status(200).json({ success: 'Logged in!' });
            });
        })(req, res, next);
    });

    // logout
    route.post('/logout', middleware.isAuth, (req, res) => {
        req.logOut();
        res.status(200).json({success: 'Logged out!'});
    });

    // get list of users
    route.get('/', middleware.isAuth, middleware.isAdmin, async (req, res) => {
        res.status(200).json(await userService.getAllUsers());
    });

    // get user by id or name
    route.get('/:id', middleware.isAuth, middleware.isAdmin, async (req, res) => {
        res.status(200).json(await userService.getUserByID(req.params.id));
    });
};