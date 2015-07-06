/**
 * Created by michaelfisher on 7/5/15.
 */
var request = require('superagent');
var async = require('async');
var feedParser = require('../../feedparser.js');
var models = require('../../model');

var processSearch = function (searchParams, cb) {
    async.waterfall([
        function (next) {
            console.log(searchParams);
            //    Go to reddit first
            request.get('https://api.reddit.com/search.json?q=' + searchParams)
                .end(function (err, res) {
                    var redditJson = JSON.parse(res.text);
                    var reddit = feedParser.processSearchResponse('Reddit', redditJson.data.children);
                    next(err, reddit);
                })
        },
        function (reddit, next) {
            request.get('http://hn.algolia.com/api/v1/search?query=' + searchParams)
                .end(function (err, res) {
                    var hnJson = JSON.parse(res.text);
                    var hn = feedParser.processSearchResponse('HackerNews', hnJson.hits);
                    next(err, reddit, hn);
                })
        },
        function (reddit, hn, next) {
            var combinedResults = reddit.concat(hn);
            next(null, combinedResults);
        }
    ], cb);
};

exports.getSearch = function (req, res, next) {
    processSearch(req.params.search_params, function (err, combinedResults) {
        if (err) {
            console.log(err);
        } else {
            res.json({results: combinedResults});
        }
    });
};

exports.saveSearchItem = function (req, res, next) {
//    Get the info from the body, transpose it into the appropriate fields
    var item = {};
    if (req.body._externalID) {
        item._externalID = req.body._externalID;
    }
    if (req.body.url) {
        item.url = req.body.url;
    }
    if (req.body.title) {
        item.title = req.body.title;
    }
    if (req.body.score) {
        item.score = req.body.score;
    }
    if (req.body.posted) {
        item.posted = req.body.posted;
    }
    if (req.body.source) {
        item.source = req.body.source;
    }
    if (req.body.createdAt) {
        item.createdAt = req.body.createdAt;
    }
    if (req.body.savedBy) {
        item.savedBy = req.body.savedBy;
    }

    models.Item.update({_externalID: item._externalID}, item, {upsert: true}, function (err, itemResponse) {
        if (err) {
            res.send(err);
        }
        else {
            res.json({message: 'success'});
        }

    });
};