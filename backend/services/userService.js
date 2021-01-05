const User = require('../model/user');
const EmailVerification = require('../model/emailVerification');
const events = require('../events');
const nanoid = require('nanoid').nanoid;

class UserService {
    constructor() {}

    async registerUser(name, email, password) {
        const userRecord = new User({
            name,
            credentials: {
                password,
                email
            }
        });

        const token = nanoid();
        const emailVerification = new EmailVerification({
            userID: userRecord._id,
            token 
        });

        try {
            await userRecord.save();
            await emailVerification.save();
        } catch (err) {
            userRecord.remove();
            emailVerification.remove();
            throw err;
        }

        events.emit(events.eventTypes.user.register, {name, email, token});

        return userRecord;
    }

    async verifyUser(token) {
        const emailVerification = await EmailVerification.findOne({token});

        if (!emailVerification) {
            return false;
        }

        const userID = emailVerification.userID;

        try {
            await User.findOneAndUpdate({_id: userID}, {$set: { 'credentials.emailVerified': true }});
            return true;
        } catch(err) {
            throw err;
        }
    }

    async isAdmin(userID) {
        const user = await User.findById(userID);
        if (!user) return false;

        return user.credentials.role === 'admin';
    }

    async getAllUsers() {
        const allUsers = await User
            .find()
            .select('lastLogin -_id name creationDate credentials')
            .exec();

        return allUsers;
    }
}

module.exports = new UserService();