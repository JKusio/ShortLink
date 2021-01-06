class BaseError extends Error {
    constructor(errorTypes, statusCode, isOperational) {
        super(JSON.stringify(errorTypes));
        Object.setPrototypeOf(this, new.target.prototype);

        this.statusCode = statusCode;
        // operational errors are expected errors like user giving bad data in request etc.
        this.isOperational = isOperational;

        Error.captureStackTrace(this);
    }
}

module.exports = BaseError;