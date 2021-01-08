const userService = require('../../../services/userService');
// Error handling
const BaseError = require('../../../errors/baseError');
const errorTypes = require('../../../errors/errorTypes');
const httpStatusCodes = require('../../../errors/httpStatusCodes');

async function isAdminMiddleware() {

}

module.exports = async (req, res, next) => {
    if (await userService.isAdmin(req.user._id)) return next();
    next(new BaseError(errorTypes.loginErrors.noAdminAccess, httpStatusCodes.UNAOTHORIZED, true));
};