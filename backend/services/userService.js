const User = require('../model/user');
const UserCredentials = require('../model/userCredentials');
const EmailVerification = require('../model/emailVerification');
const MailingService = require('./mailingService');
const events = require('../events');

// token will be uuidv4
function getToken() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });      
}

class UserService {
    constructor() {
        this.mailingService = new MailingService();
    }

    async registerUser(name, email, password) {
        const userRecord = new User({
            name: name
        });

        try {
            await userRecord.save();
        } catch (err) {
            throw err;
        }

        const userCredentials = new UserCredentials({
            userID: userRecord._id,
            password,
            email,
        });

        try {
            await userCredentials.save();
        } catch (err) {
            userRecord.remove();
            throw err;
        }

        const token = getToken();

        const emailVerification = new EmailVerification({
            userID: userRecord._id,
            token 
        });

        try {
            await emailVerification.save();
        } catch (err) {
            userCredentials.remove();
            userRecord.remove();
            throw err;
        }

        events.emit(events.eventTypes.user.register, {name, email});

        return userRecord;
    }

    async verifyUser(token) {
        const emailVerification = await EmailVerification.findOne({token});

        if (!emailVerification) {
            return false;
        }

        const userID = emailVerification.userID;

        try {
            await UserCredentials.updateOne({userID}, {emailVerified: true});
            return true;
        } catch(err) {
            throw new Error('Couldn\'t verify user!');
        }
    }

    async updateUserLastLogin(id) {
        try {
            await User.updateOne({_id: id}, {lastLogin: Date.now()});
        } catch (err) {
            throw new Error('Couldn\'t update user last login time!');
        }
    }
}

module.exports = UserService;