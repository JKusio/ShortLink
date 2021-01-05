const route = require('express').Router();
const linkService = require('../../services/linkService');
const middleware = require('./middleware');
const passport = require('passport');
const events = require('../../events');
const { Router } = require('express');

module.exports = (app) => {
    app.use('/links', route);

    // get all shortened links
    route.get('/', middleware.isAuth, middleware.isAdmin, async (req, res) => {
        res.status(200).json(await linkService.getAllLinks());
    });

    /**
     * Add new shortened link
     * You don't have to be logged in to add one
     *  */ 
    route.post('/', async(req, res) => {
        // optional chaining was added in node 14.0 version
        const userID = req.user?._id;
        try {
            await linkService.createLink(req.body.URL, userID, req.body.code, req.body.expirationDate);
            res.status(200).json({success: "done!"});
        } catch (err) {
            res.status(500).json({error: 'error!'});
        }
    });
};