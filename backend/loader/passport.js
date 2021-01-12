const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('../model/user');
const passport = require('passport');
// Error handling
const BaseError = require('../error/baseError');
const errorTypes = require('../error/errorTypes');
const httpStatusCodes = require('../error/httpStatusCodes');

module.exports = () => {
    passport.use(new LocalStrategy({usernameField: 'name'}, async (name, password, done) => {
        const user = await User.findOne({name});
        if (!user) {
            return done(new BaseError(errorTypes.loginErrors.wrongCredentials, httpStatusCodes.BAD_REQUEST, true));
        }

        try {
            if (await bcrypt.compare(password, user.credentials.password)) {
                if (!user.credentials.emailVerified) {
                    return done(new BaseError(errorTypes.loginErrors.accountNotVerified, httpStatusCodes.UNAOTHORIZED, true));
                }        
                return done(null, user);
            } else {
                return done(new BaseError(errorTypes.loginErrors.wrongCredentials, httpStatusCodes.BAD_REQUEST, true));
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