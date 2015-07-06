/**
 * Created by michaelfisher on 6/27/15.
 */
/*jslint node: true */
"use strict";
var routes = require('./routes');
var config = require('../../../appconfig.js');


module.exports = function (app, express, feedfetcher) {

    // Grab the express router, so we can implement our own routing
    var apiRouter = express.Router();

    // Authenticate, send a token back.
    apiRouter.post('/authenticate', routes.auth.authenticate);

    // Get user information
    apiRouter.get('/me', routes.auth.authorize, routes.auth.me);

    // Get items by page
    apiRouter.get('/all/page/:page', routes.item.page);

    // Feeds
    apiRouter.get('/feeds', routes.feed.list);
    // Add new feed.
    apiRouter.post('/feeds', routes.auth.authorize, routes.feed.add);
    // Get feed by ID
    apiRouter.get('/feeds/:feed_id', routes.feed.single);
    // update feed
    apiRouter.put('/feeds/:feed_id', routes.auth.authorize, routes.feed.update);
    // Delete a feed
    apiRouter.delete('/feeds/:feed_id', routes.auth.authorize, routes.feed.remove);

    // Search based on params
    apiRouter.get('/search/:search_params', routes.auth.authorize, routes.search.getSearch);

    // Save a search result item to Mongo
    apiRouter.post('/search', routes.auth.authorize, routes.search.saveSearchItem);

    // Get saved items by user
    apiRouter.get('/saved/page/:page_number', routes.auth.authorize, routes.saved.page);
    // Save an item
    apiRouter.post('/saved', routes.auth.authorize, routes.saved.save);
    // Delete a saved item
    apiRouter.delete('/saved/:item_id', routes.auth.authorize, routes.saved.delete);

    // force refresh
    // todo:  refactor this out into it's own file
    apiRouter.get('/fetch', routes.auth.authorize, function (req, res) {
        feedfetcher.fetch();
        res.json({message: 'refreshing'});
    });

    // Route to create test user
    // Should eventually be supplanted by normal routes for user registration
    apiRouter.get('/test', routes.user.testCreate);

    apiRouter.delete('/test/:user_id', routes.auth.authorize, routes.user.testDelete);

    // Return configured API Router
    return apiRouter;
};