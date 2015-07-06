/**
 * Created by michaelfisher on 7/1/15.
 */
/*jslint node: true */
"use strict";
var Feed = require('../../model/feed.js');
var async = require('async');
/**
 * Feeds GET route
 * GET /api/feeds
 * Lists all feeds currently in database
 * @param req
 * @param res
 * @param next
 */
exports.list = function (req, res, next) {
    Feed.find({}, function (error, feeds) {
        if (error) res.send(error);

        //    Return the feeds
        res.json({feeds: feeds});
    });
};

/**
 * Feeds POST route
 * POST /api/feeds
 * Adds a new feed to the database
 * @param req
 * @param res
 * @param next
 */
exports.add = function (req, res, next) {

    var feed = new Feed();
    feed.url = req.body.url;

    feed.save(function (error, feed) {
        if (error) {
            res.send(error);
        } else {
            // Return a success message
            res.json({message: 'Feed added!', feed: feed});
        }
    });
};

/**
 * Single feed GET route
 * GET /api/feeds/:feed_id
 * Gets a single feed by ID
 * @param req
 * @param res
 * @param next
 */
exports.single = function (req, res, next) {
    Feed.findById(req.params.feed_id, function (error, feed) {
        if (error) res.send(error);

        //    Return that feed
        res.json({feed: feed});
    });
};

/**
 * Single feed PUT route
 * PUT /api/feeds/:feed_id
 * Updates a feed
 * @param req
 * @param res
 */
exports.update = function (req, res) {
    Feed.findById(req.params.feed_id, function (error, feed) {
        if (error) res.send(error);

        //    Set the new feed information if it exists in the request
        if (req.body.url) feed.url = req.body.url;

        //    Save it back
        feed.save(function (error) {
            if (error) res.send(error);

            //    Return a message
            res.json({message: 'Feed updated!', feed: feed});
        });
    });
};


/**
 * Used by delete route to delete a feed by ID
 * TODO:  evaluate if this is even needed.  itemCount is not being returned or utilized.
 * @param feedId
 * @param cb
 */
var buildDeleteResponse = function (feedId, cb) {
    async.waterfall([
        function (next) {
            Feed.remove({_id: feedId}).exec(next);
        },
        function (itemCount, next) {
            Feed.find({}).exec(function (err, feeds) {
                next(err, feeds);
            });
        },
        function (feeds, next) {
            next(null, feeds);
        }
    ], cb);
};

exports.remove = function (req, res) {
    buildDeleteResponse(req.params.feed_id, function (error, feeds) {
        if (error) res.send(error);
        res.json({message: 'Feed deleted', feeds: feeds});
    });
};




