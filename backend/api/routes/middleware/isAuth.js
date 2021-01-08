// Error handling
const BaseError = require('../../../errors/baseError');
const errorTypes = require('../../../errors/errorTypes');
const httpStatusCodes = require('../../../errors/httpStatusCodes');

module.exports = (req, res, next) => {
    if (req.isAuthenticated()) return next();
    next(new BaseError(errorTypes.loginErrors.notAuthenticated, httpStatusCodes.UNAOTHORIZED, true));
};