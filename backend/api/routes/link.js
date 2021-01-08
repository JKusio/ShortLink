const route = require('express').Router();
const linkService = require('../../services/linkService');
const middleware = require('./middleware');
const userService = require('../../services/userService');

module.exports = (app) => {
    app.use('/links', route);

    // get all shortened links
    route.get('/', middleware.isAuth, middleware.isAdmin, async (req, res, next) => {
        res.status(200).json(await linkService.getAllLinks());
    });

    /**
     * Add new shortened link
     * You don't have to be logged in to add one
     *  */ 
    route.post('/', async(req, res, next) => {
        // optional chaining was added in node 14.0 version
        const userID = req.user?._id;
        try {
            const link = await linkService.createLink(req.body.URL, `${req.protocol}://${req.get('host')}`, userID, req.body.code, req.body.expirationDate);
            if (userID) await userService.addLinkToUser(userID, link.code);
            res.status(200).json(link);
        } catch (err) {
            next(err);
        }
    });
};