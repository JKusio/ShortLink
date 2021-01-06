const BaseError = require('./baseError');

class ErrorHandler { 
    // send to admin if critical
    handleError(error) {
        
    }

    isTrustedError(error) {
        if (error instanceof BaseError) {
            return error.isOperational;
        }
        return false;
    }
}

module.exports = new ErrorHandler();