const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('../model/user');
const passport = require('passport');

module.exports = () => {
    passport.use(new LocalStrategy({usernameField: 'name'}, async (name, password, done) => {
        const user = await User.findOne({name});
        if (!user) {
            return done(null, false, { code: 201 });
        }

        try {
            if (await bcrypt.compare(password, user.credentials.password)) {
                if (!user.credentials.emailVerified) {
                    return done(null, false, { code: 202 });
                }        
                return done(null, user);
            } else {
                return done(null, false, { code: 201});
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