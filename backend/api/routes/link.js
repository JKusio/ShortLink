const route = require('express').Router();
const middleware = require('../middleware');
const { container } = require('../../loader/container');

module.exports = (app) => {
    app.use('/links', route);

    // get all shortened links
    route.get('/', middleware.isAuth, middleware.isAdmin, async (req, res) => {
        const linkService = container.resolve('linkService');
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
            const linkService = container.resolve('linkService');
            const link = await linkService.createLink(req.body.URL, `${req.protocol}://${req.get('host')}`, userID, req.body.code, req.body.expirationDate);
            if (userID) {
                const userService = container.resolve('userService');
                await userService.addLinkToUser(userID, link.code);
            }
            res.status(200).json(link);
        } catch (err) {
            next(err);
        }
    });
};