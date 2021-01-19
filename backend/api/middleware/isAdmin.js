const { container } = require('../../loader/container');
const errorHandler = require('../../error');

module.exports = async (req, res, next) => {
    const userService = container.resolve('userService');
    if (await userService.isAdmin(req.user._id)) return next();
    return next(errorHandler.createBaseError(errorHandler.errorTypes.loginErrors.noAdminAccess, errorHandler.httpStatusCodes.UNAOTHORIZED, true));
};