/**
 * Created by michaelfisher on 7/1/15.
 */
var Feed = require('../../model/feed.js');
// list feeds
exports.list = function (req, res, next) {
    Feed.find({}, function (error, feeds) {
        if (error) res.send(error);

        //    Return the feeds
        res.json(feeds)
    });
};

exports.add = function (req, res, next) {

    var feed = new Feed();
    feed.url = req.body.url;

    feed.save(function (error) {
        if (error) {
            res.send(error);
        } else {
            res.json({message: 'Feed added!'});
        }
    });
};

exports.single = function (req, res, next) {
    Feed.findById(req.params.feed_id, function (error, feed) {
        if (error) res.send(error);

        //    Return that feed
        res.json(feed);
    });
};

exports.update = function (req, res) {
    Feed.findById(req.params.feed_id, function (error, feed) {
        if (error) res.send(error);

        //    Set the new feed information if it exists in the request
        if (req.body.url) feed.url = req.body.url;

        //    Save it back
        feed.save(function (error) {
            if (error) res.send(error);

            //    Return a message
            res.json({message: 'Feed updated!'});
        });
    });
};


/**
 * Find a feed by ID, delete it, and return the remaining Feeds
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
    })
};




