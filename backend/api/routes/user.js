const route = require('express').Router();
const UserService = require('../../services/userService');
const middleware = require('./middleware');
const passport = require('passport');
const events = require('../../events');

module.exports = (app) => {
    app.use('/users', route);

    route.post('/register', async (req, res) => {
        const userService = new UserService();
        try {
            const user = await userService.registerUser(req.body.name, req.body.email, req.body.password);
            res.status(200).send({message: `Successfully registered new user - ${user.name}`});
        } catch (err) {
            // validation errors
            if (err.errors) {
                const errorKeys = Object.keys(err.errors);

                console.log(err.errors);

                const lengthError = errorKeys.map((key) => err.errors[key].kind.includes('length')).includes(true);
                
                if (lengthError) {
                    return res.status(400).send({ error: 'Password needs to be between 8 and 32 characters!'});
                }
            }
            
            // other errors
            if (err.code === 11000) {
                res.status(400).send({ error: 'Username already taken!'});
            }
        }
    });

    route.get('/verify/:token', (req, res) => {
        const userService = new UserService();
        const verified = userService.verifyUser(req.params.token);

        if (verified) {
            res.status(200).send({messaage: 'User verified!'});
        } else {
            req.status(401).send({error: 'Couldn\'t verify user!'});
        }
    });

    route.post('/login', passport.authenticate('local'), async (req, res) => {
        events.emit(events.eventTypes.user.login, req.user._id);
        res.status(200).send({ message: 'Successfully logged!' });
    });

    route.post('/logout', middleware.isAuth, (req, res) => {
        req.logOut();
        res.status(200).send({message: 'User logged out!'});
    });

    route.get('/me', middleware.isAuth, async (req, res) => {
        res.status(200).send({ message: req.user });
    });
};