module.exports = (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.status(401).send({ message: 'You are not authenticated to commit this action!' });
};