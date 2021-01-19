const ip = require('ip');
const Logger = require('../loader/logger');
const config = require('../config');

module.exports = (eventEmitter, mailingService, UserModel) => {
    eventEmitter.on(eventEmitter.eventTypes.user.register, async (userData) => {
        await mailingService.sendMail(userData.email, 'ShortLink - verify your email!', `<h1>Hi ${userData.name}! </h1> \nThank you for registering in ShortLink app! \nTo verify your account please click <a href="http://${ip.address()}:${config.port}/api/users/verify/${userData.token}"> this! </a>`);
    });

    eventEmitter.on(eventEmitter.eventTypes.user.login, async (userID) => {
        try {
            await UserModel.updateOne({_id: userID}, {lastLogin: Date.now()});
        } catch (err) {
            Logger.error(err);
        }
    });
}