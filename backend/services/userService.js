const { nanoid } = require('nanoid');
const mongoose = require('mongoose');
const User = require('../model/user');
const EmailVerification = require('../model/emailVerification');
const events = require('../event');
const eventTypes = require('../event/eventTypes');
// Error handling
const BaseError = require('../error/baseError');
const errorTypes = require('../error/errorTypes');
const httpStatusCodes = require('../error/httpStatusCodes');
const errorHandler = require('../error/errorHandler');

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
            throw errorHandler.getUserModelErrors(err);
        }

        events.emit(eventTypes.user.register, {name, email, token});

        return userRecord;
    }

    async verifyUser(token) {
        const emailVerification = await EmailVerification.findOne({token});

        if (!emailVerification) throw new BaseError(errorTypes.credentialsError.wrongVerficationToken, httpStatusCodes.BAD_REQUEST, true);

        const { userID } = emailVerification;

        await User.findOneAndUpdate({_id: userID}, {$set: { 'credentials.emailVerified': true }}, {useFindAndModify: false});
        await emailVerification.remove();
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
        let user;

        if (mongoose.isValidObjectId(id)) {
            user = await User.findOne({_id: id});
        }
        if (user) return user;
        return User.findOne({name: id});
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