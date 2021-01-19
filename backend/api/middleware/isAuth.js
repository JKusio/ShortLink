const errorHandler = require('../../error');

module.exports = (req, res, next) => {
    if (req.isAuthenticated()) return next();
    return next(errorHandler.createBaseError(errorHandler.errorTypes.loginErrors.notAuthenticated, errorHandler.httpStatusCodes.UNAOTHORIZED, true));
};