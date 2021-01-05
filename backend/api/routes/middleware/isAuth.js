module.exports = (req, res, next) => {
    if (req.isAuthenticated()) return next();
    return res.status(401).send({ code: 200,
        type: 'Login error',
        errors: [
            {
                code: 203,
                message: "Not authenticated"
            }
        ]  
    });
};