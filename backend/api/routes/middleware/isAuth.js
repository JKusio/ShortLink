// Error handling
const BaseError = require('../../../error/baseError');
const errorTypes = require('../../../error/errorTypes');
const httpStatusCodes = require('../../../error/httpStatusCodes');

module.exports = (req, res, next) => {
    if (req.isAuthenticated()) return next();
    return next(new BaseError(errorTypes.loginErrors.notAuthenticated, httpStatusCodes.UNAOTHORIZED, true));
};