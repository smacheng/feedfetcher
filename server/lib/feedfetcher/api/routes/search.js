/**
 * Created by michaelfisher on 7/5/15.
 */
var request = require('superagent');
var async = require('async');
var feedParser = require('../../feedparser.js');

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

};