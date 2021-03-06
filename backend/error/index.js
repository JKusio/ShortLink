/* eslint-disable class-methods-use-this */
const BaseError = require('./baseError');
const errorTypes = require('./errorTypes');
const httpStatusCodes = require('./httpStatusCodes');

class ErrorHandler {
    getUserModelErrors(err) {
        if (err.message != null && err.message.includes('ECONNREFUSED')) {
            return new BaseError(
                errorTypes.serverErrors.mongodbConnectionError,
                httpStatusCodes.INTERNAL_SERVER,
                false
            );
        }

        const errors = [];

        if (err.errors) {
            const errorKeys = Object.keys(err.errors);

            if (errorKeys.includes('name'))
                errors.push(errorTypes.credentialsError.wrongUsername);
            if (errorKeys.includes('credentials.email'))
                errors.push(errorTypes.credentialsError.wrongEmail);
            if (errorKeys.includes('credentials.password'))
                errors.push(errorTypes.credentialsError.wrongPassword);
        }

        if (err.code === 11000) {
            if (err.keyPattern.name)
                errors.push(errorTypes.credentialsError.usernameTaken);
            if (err.keyPattern['credentials.email'])
                errors.push(errorTypes.credentialsError.emailTaken);
        }

        return new BaseError(errors, httpStatusCodes.BAD_REQUEST, true);
    }

    isTrustedError(error) {
        if (error instanceof BaseError) {
            return error.isOperational;
        }
        return false;
    }

    createBaseError(errTypes, statusCode, isOperational) {
        return new BaseError(errTypes, statusCode, isOperational);
    }

    get errorTypes() {
        return errorTypes;
    }

    get httpStatusCodes() {
        return httpStatusCodes;
    }
}

module.exports = new ErrorHandler();
