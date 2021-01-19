const { nanoid } = require('nanoid');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const errorHandler = require('../error');

class UserService {
    constructor(
        UserModel,
        EmailVerificationModel,
        eventHandler
    ) {
        this.UserModel = UserModel;
        this.EmailVerificationModel = EmailVerificationModel;
        this.eventHandler = eventHandler;
    }

    async registerUser(name, email, password) {
        const userRecord = new this.UserModel({
            name,
            credentials: {
                password,
                email
            }
        });

        const token = nanoid();
        const emailVerification = new this.EmailVerificationModel({
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

        this.eventHandler.emit(this.eventHandler.eventTypes.user.register, { name, email, token });

        return userRecord;
    }

    async authenticate(name, password) {
        const user = await this.UserModel.findOne({name});

        if (!user) {
            throw errorHandler.createBaseError(errorHandler.errorTypes.loginErrors.wrongCredentials, errorHandler.httpStatusCodes.BAD_REQUEST, true)
        }

        if (await bcrypt.compare(password, user.credentials.password)) {
            if (!user.credentials.emailVerified) {
                throw errorHandler.createBaseError(errorHandler.errorTypes.loginErrors.accountNotVerified, errorHandler.httpStatusCodes.UNAOTHORIZED, true);
            }        
            return user;
        } 
        
        throw errorHandler.createBaseError(errorHandler.errorTypes.loginErrors.wrongCredentials, errorHandler.httpStatusCodes.BAD_REQUEST, true);
    }

    async verifyUser(token) {
        const emailVerification = await this.EmailVerificationModel.findOne({
            token
        });

        if (!emailVerification)
            throw errorHandler.createBaseError(
                errorHandler.errorTypes.credentialsError.wrongVerficationToken,
                errorHandler.httpStatusCodes.BAD_REQUEST,
                true
            );

        const { userID } = emailVerification;

        await this.UserModel.findOneAndUpdate(
            { _id: userID },
            { $set: { 'credentials.emailVerified': true } },
            { useFindAndModify: false }
        );
        await emailVerification.remove();
    }

    async isAdmin(userID) {
        const user = await this.UserModel.findById(userID);
        if (!user) return false;

        return user.credentials.role === 'admin';
    }

    async getAllUsers() {
        const allUsers = await this.UserModel.find()
            .select('lastLogin -_id name creationDate credentials')
            .exec();

        return allUsers;
    }

    async getUserByID(id) {
        let user;

        if (mongoose.isValidObjectId(id)) {
            user = await this.UserModel.findOne({ _id: id });
        }
        if (user) return user;
        return this.UserModel.findOne({ name: id });
    }

    async changeUserEmail(userID, email) {
        try {
            await this.UserModel.findOneAndUpdate(
                { _id: userID },
                { $set: { 'credentials.email': email } },
                { useFindAndModify: false, runValidators: true }
            );
        } catch (err) {
            throw errorHandler.getUserModelErrors(err);
        }
    }

    async changeUserPassword(userID, password) {
        const user = await this.UserModel.findOne({ _id: userID });
        // it shouldn't happen, but what if it does?
        if (!user)
            throw errorHandler.createBaseError(
                errorHandler.errorTypes.credentialsError.userDoesNotExists,
                errorHandler.httpStatusCodes.BAD_REQUEST,
                true
            );

        user.credentials.password = password;

        try {
            await user.save();
        } catch (err) {
            throw errorHandler.getUserModelErrors(err);
        }
    }

    async addLinkToUser(userID, linkCode) {
        try {
            await this.UserModel.findOneAndUpdate(
                { _id: userID },
                { $push: { links: linkCode } },
                { useFindAndModify: false }
            );
        } catch (err) {
            throw errorHandler.getUserModelErrors(err);
        }
    }

    async removeUserById(id) {
        const user = await this.getUserByID(id);
        if (user) {
            await user.remove();
        } else {
            throw errorHandler.createBaseError(
                errorHandler.errorTypes.credentialsError.userDoesNotExists,
                errorHandler.httpStatusCodes.BAD_REQUEST,
                true
            );
        }
    }
}

module.exports = UserService;
