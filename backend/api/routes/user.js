const route = require('express').Router();
const UserService = require('../../services/userService');
const middleware = require('./middleware');

module.exports = (app, passport) => {
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

    route.post('/login', passport.authenticate('local'), (req, res) => {
        res.status(200).send({ message: 'Successfully logged!' });
    });

    route.get('/me', middleware.isAuth, async (req, res) => {
        res.status(200).send({ message: req.user });
    });
};