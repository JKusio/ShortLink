const User = require('../model/user');
const EmailVerification = require('../model/emailVerification');
const events = require('../events');
const nanoid = require('nanoid').nanoid;
const mongoose = require('mongoose');
// Error handling
const BaseError = require('../errors/baseError');
const errorTypes = require('../errors/errorTypes');
const httpStatusCodes = require('../errors/httpStatusCodes');
const ErrorHandler = require('../errors/errorHandler');
const errorHandler = require('../errors/errorHandler');

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
            console.log(err);
            userRecord.remove();
            emailVerification.remove();

            throw errorHandler.getUserModelErrors(err);
        }

        events.emit(events.eventTypes.user.register, {name, email, token});

        return userRecord;
    }

    async verifyUser(token) {
        const emailVerification = await EmailVerification.findOne({token});

        if (!emailVerification) throw new BaseError(errorTypes.credentialsError.wrongVerficationToken, httpStatusCodes.BAD_REQUEST, true);

        const userID = emailVerification.userID;

        try {
            await User.findOneAndUpdate({_id: userID}, {$set: { 'credentials.emailVerified': true }}, {useFindAndModify: false});
            await emailVerification.remove();
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

    async changeUserEmail(userID, email) {
        try {
            await User.findOneAndUpdate({_id: userID}, {$set: { 'credentials.email': email }}, {useFindAndModify: false, runValidators: true});
        } catch (err) {
            throw errorHandler.getUserModelErrors(err);
        }
    }

    async changeUserPassword(userID, password) {
        const user = await User.findOne({_id: userID});
        // it shouldn't happen, but what if it does?
        if (!user) throw new BaseError(errorTypes.userErrors.userDoesNotExists, httpStatusCodes.BAD_REQUEST, false);

        user.credentials.password = password;

        try {
            await user.save();
        } catch (err) {
            throw errorHandler.getUserModelErrors(err);
        }
    }

    async addLinkToUser(userID, linkCode) {
        try {
            await User.findOneAndUpdate({_id: userID}, {$push: { 'links': linkCode }}, {useFindAndModify: false});
        } catch (err) {
            throw errorHandler.getUserModelErrors(err);
        }
    }

    async removeUserById(id) {
        const user = await this.getUserByID(id);
        if (user) {
            await user.remove();
        } else {
            throw new BaseError(errorTypes.userErrors.userDoesNotExists, httpStatusCodes.BAD_REQUEST, true);
        }
    }
}

module.exports = new UserService();