class BaseError extends Error {
    constructor(errorTypes, statusCode, isOperational) {
        if (!Array.isArray(errorTypes)) errorTypes = [errorTypes];

        super(errorTypes.map((errorType) => errorType.message).join("\n"));
        Object.setPrototypeOf(this, new.target.prototype);
        
        this.errorTypes = errorTypes;

        this.statusCode = statusCode;
        // operational errors are expected errors like user giving bad data in request etc.
        this.isOperational = isOperational;

        Error.captureStackTrace(this);
    }
}

module.exports = BaseError;