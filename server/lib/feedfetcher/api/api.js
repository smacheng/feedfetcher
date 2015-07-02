/**
 * Created by michaelfisher on 6/27/15.
 */

var feedfetcher = require('../index.js');
var routes = require('./routes');

module.exports = function (app, express) {
    // Grab the express router, so we can implement our own routing
    var apiRouter = express.Router();

    // Authenticate, send a token back.
    apiRouter.post('/authenticate', routes.auth.authenticate);

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

    // force refresh
    apiRouter.get('/fetch', function (req, res) {
        feedfetcher.fetch();
        res.json({message: 'refreshing'});
    });

    // Return configured API Router
    return apiRouter;
};