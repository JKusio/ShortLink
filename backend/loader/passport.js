const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('../model/user');
const UserCredentials = require('../model/userCredentials');
const UserService = require('../services/userService');
const passport = require('passport');

module.exports = () => {
    passport.use(new LocalStrategy({usernameField: 'name'}, async (name, password, done) => {
        const user = await User.findOne({name});
        if (!user) {
            return done(null, false, { message: 'No user was found with given name!' });
        }

        const userCredentials = await UserCredentials.findOne({userID: user._id});
        if (!userCredentials) {
            return done(null, false, { message: 'No user credentials were found! Contact with the admin! '});
        }

        try {
            if (await bcrypt.compare(password, userCredentials.password)) {
                const userService = new UserService();
                return done(null, user);
            } else {
                return done(null, false, { message: 'Incorrect password!'});
            }
        } catch (err) {
            throw err;
        }
    }));

    passport.serializeUser((user, done) => done(null, user._id));
    passport.deserializeUser(async (id, done) => {
        const user = await User.findOne({_id: id});
        return done(null, user);
    });
};