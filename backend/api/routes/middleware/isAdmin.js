const userService = require('../../../services/userService');
// Error handling
const BaseError = require('../../../error/baseError');
const errorTypes = require('../../../error/errorTypes');
const httpStatusCodes = require('../../../error/httpStatusCodes');

async function isAdminMiddleware() {

}

module.exports = async (req, res, next) => {
    if (await userService.isAdmin(req.user._id)) return next();
    next(new BaseError(errorTypes.loginErrors.noAdminAccess, httpStatusCodes.UNAOTHORIZED, true));
};