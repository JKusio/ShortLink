const route = require('express').Router();
const userService = require('../../services/userService');
const middleware = require('./middleware');
const passport = require('passport');
const events = require('../../events');

module.exports = (app) => {
    app.use('/users', route);

    // register
    route.post('/register', async (req, res) => {
        try {
            await userService.registerUser(req.body.name, req.body.email, req.body.password);
            // when user is created we will be only sending an 200 OK response, because all the created data is private (like id, hashed password etc.)
            res.status(200).end();
        } catch (err) {
            if (err.message != null && err.message.includes('ECONNREFUSED')) {
                res.status(500).end();
            } else {
                const reqError = {
                    code: 100,
                    type: 'Register error',
                    errors: [
                    ]
                }
    
                if (err.errors) {
                    const errorKeys = Object.keys(err.errors);
        
                    if (errorKeys.includes('name')) {
                        reqError.errors.push({
                            code: 101,
                            message: 'Username too short/long'
                        });
                    }
    
                    if (errorKeys.includes('email')) {
                        reqError.errors.push({
                            code: 102,
                            message: 'Email not correct'
                        });
                    }
    
                    if (errorKeys.includes('password')) {
                        reqError.errors.push({
                            code: 103,
                            message: 'Password too short/long'
                        });
                    }
                }
                
                // not unique
                if (err.code === 11000) {
                    if (err.keyPattern.name) {
                        reqError.errors.push({
                            code: 104,
                            message: 'Username already taken'
                        });
                    }
    
                    if (err.keyPattern.email) {
                        reqError.errors.push({
                            code: 105,
                            message: 'Email already taken'
                        });
                    }
                }
    
                res.status(400).json(reqError);
            }
        }
    });

    // verify token sent to email
    route.get('/verify/:token', async (req, res) => {
        try {
            const verified = await userService.verifyUser(req.params.token);

            if (verified) {
                res.status(200).json({messaage: 'User verified!'});
            } else {
                const reqError = {
                    code: 100,
                    type: 'Register error',
                    errors: [{
                        code: 106,
                        messaage: 'Wrong verification token'
                    }]
                }
    
                req.status(400).json(reqError);
            }
        } catch (err) {
            res.status(500).end();
        }
    });

    // login
    route.get('/login', (req, res, next) => {
        passport.authenticate('local', (err, user, info) => {
            if (err) { return next (err); }
            if (!user) { 
                const reqError = {
                    code: 200,
                    type: 'Login error',
                    errors: [
                    ]
                };

                if (info) {
                    if (info.code === 201) {
                        reqError.errors.push({
                            code: 201,
                            message: 'Wrong name/password combination'
                        });
                    } 

                    if (info.code === 202) {
                        reqError.errors.push({
                            code: 202,
                            message: 'Account not verified'
                        });
                    }
                }
                return res.status(401).json(reqError);
            } 

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
};