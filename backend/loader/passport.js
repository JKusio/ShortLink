const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');
const { container } = require('./container');

module.exports = () => {
    const userService = container.resolve('userService');
    const UserModel = container.resolve('UserModel');

    passport.use(new LocalStrategy({usernameField: 'name'}, async (name, password, done) => {
        try {
            const user = await userService.authenticate(name, password);
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }));

    passport.serializeUser((user, done) => done(null, user._id));
    passport.deserializeUser(async (id, done) => {
        const user = await UserModel.findOne({_id: id});
        return done(null, user);
    });
};