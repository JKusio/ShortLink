const User = require('../model/user');
const EmailVerification = require('../model/emailVerification');
const events = require('../events');
const nanoid = require('nanoid').nanoid;
// Error handling
const BaseError = require('../errors/baseError');
const errorTypes = require('../errors/errorTypes');
const httpStatusCodes = require('../errors/httpStatusCodes');
const mongoose = require('mongoose');

class UserService {
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

            if (err.message != null && err.message.includes('ECONNREFUSED')) {
                throw new BaseError(errorTypes.serverErrors.mongodbConnectionError, httpStatusCodes.INTERNAL_SERVER, false);
            } 

            const errors = [];

            if (err.errors) { 
                const errorKeys = Object.keys(err.errors);
                if (errorKeys.includes('name')) errors.push(errorTypes.registerErrors.wrongUsernameLength);
                if (errorKeys.includes('credentials.email')) errors.push(errorTypes.registerErrors.wrongEmail);
                if (errorKeys.includes('credentials.password')) errors.push(errorTypes.registerErrors.wrongPasswordLength);

                throw new BaseError(errors, httpStatusCodes.BAD_REQUEST, true);
            }
            
            if (err.code === 11000) {
                if (err.keyPattern.name) errors.push(errorTypes.registerErrors.usernameTaken);
                if (err.keyPattern['credentials.email']) errors.push(errorTypes.registerErrors.emailTaken);
            }

            throw new BaseError(errors, httpStatusCodes.BAD_REQUEST, true);
        }

        events.emit(events.eventTypes.user.register, {name, email, token});

        return userRecord;
    }

    async verifyUser(token) {
        const emailVerification = await EmailVerification.findOne({token});

        if (!emailVerification) throw new BaseError(errorTypes.registerErrors.wrongVerficationToken, httpStatusCodes.BAD_REQUEST, true);

        const userID = emailVerification.userID;

        try {
            await User.findOneAndUpdate({_id: userID}, {$set: { 'credentials.emailVerified': true }});
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

    async getUserByID(id) {
        if (mongoose.isValidObjectId(id)) {
            var user = await User.findOne({_id: id});
        }
        if (user) return user;
        return await User.findOne({name: id});
    }
}

module.exports = new UserService();