const route = require('express').Router();
const userService = require('../../services/userService');
const middleware = require('./middleware');
const passport = require('passport');
const events = require('../../event');

module.exports = (app) => {
    app.use('/users', route);

    // register
    route.post('/register', async (req, res, next) => {
        try {
            await userService.registerUser(req.body.name, req.body.email, req.body.password);
            // when user is created we will be only sending an 200 OK response, because all the created data is private (like id, hashed password etc.)
            res.status(200).json({success: 'User registred successfully!'});
        } catch (err) {
            next(err);
        }
    });

    // verify token sent to email
    route.get('/verify/:token', async (req, res, next) => {
        try {
            await userService.verifyUser(req.params.token);
            res.status(200).json({success: 'User verified successfully!'});
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

    // change user's own email
    route.patch('/email', middleware.isAuth, async (req, res, next) => {
        try {
            await userService.changeUserEmail(req.user._id, req.body.email);
            res.status(200).json({
                success: 'Email changed successfully'
            })
        } catch (err) {
            next(err);
        }
    });
    
    // change user's own password
    route.patch('/password', middleware.isAuth, async (req, res, next) => {
        try {
            await userService.changeUserPassword(req.user._id, req.body.password);
            res.status(200).json({
                success: 'Password changed successfully'
            })
        } catch (err) {
            next(err);
        }
    });

    // ADMIN REQUESTS
    // get list of users
    route.get('/', middleware.isAuth, middleware.isAdmin, async (req, res) => {
        res.status(200).json(await userService.getAllUsers());
    });

    // get user by id or name
    route.get('/:id', middleware.isAuth, middleware.isAdmin, async (req, res) => {
        const user = await userService.getUserByID(req.params.id) || {};
        res.status(200).json(user);
    });

    // delete user by id or name
    route.delete('/:id', middleware.isAuth, middleware.isAdmin, async (req, res, next) => {
        try {
            await userService.removeUserById(req.params.id);
            res.send({success: `Deleted user with id = ${req.params.id}`});
        } catch (err) {
            next(err);
        }   
    });
};