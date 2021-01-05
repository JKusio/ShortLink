const userService = require('../../../services/userService');

module.exports = async (req, res, next) => {
    if (await userService.isAdmin(req.user._id)) return next();
    return res.status(401).send({ code: 200,
        type: 'Login error',
        errors: [
            {
                code: 204,
                message: "No admin access"
            }
        ]  
    });
};