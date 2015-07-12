/**
 * Created by michaelfisher on 6/27/15.
 */
/*jslint node: true */
"use strict";
var request = require('superagent');
var async = require('async');
var parser = require('./feedparser');

//    Setup
var FeedFetcher = {};
var feeds = [];
var timerDelay;
var fetchTimer;

/**
 * Sets up FeedFetcher
 * Opt is unused currently, eventually would like to make timerDelay modifiable
 * @param opt
 */
FeedFetcher.init = function init(opt) {
    getFeeds();
    // TODO:  make timerDelay a modifiable property
    // Default:  10 minutes
    timerDelay = 1000 * 25;
};

/**
 * Export the API used by FeedFetcher
 * @type {*|exports|module.exports}
 */
FeedFetcher.api = require('./api/api.js');

/**
 * Export the model items
 * @type {exports|module.exports}
 */
FeedFetcher.model = require('./model/index.js');


var fetchFeed = function fetchFeed(feed) {
    request.get(feed.url)
        .end(function (err, res) {
            if (err) {
                console.log(err);
            }
            // Make sure that the status code is 200 before attempting to parse the object
            if (res.statusCode === 200) {
                parser.processResponse(res);
            }
        });
};
/**
 * Fetches all feeds currently loaded.
 * TODO:  Make this method get the list of feeds from Mongo so it is up to date before fetching.
 * TODO:  Have this method accept a callback so we know when fetching is completed.
 */
FeedFetcher.fetch = function fetch() {
    for (var i = 0; i < feeds.length; i++) {
        var feed = feeds[i];
        fetchFeed(feed);
    }
};

/**
 * Stops timers
 */
FeedFetcher.invalidateTimers = function () {
    clearInterval(fetchTimer);
};

/**
 * Starts the timers with the specific delay.
 * @param delay
 */
FeedFetcher.startTimers = function (delay) {
    fetchTimer = setInterval(
        this.fetch, timerDelay);
};

/**
 * Loads the models for feeds.
 */
var getFeeds = function getFeeds() {
    FeedFetcher.model.Feed.list(function (err, feedResponse) {
        feeds = feedResponse;
        FeedFetcher.startTimers(timerDelay);
    });
};
/**
 * Export FeedFetcher Object.
 * @type {{}}
 */
module.exports = FeedFetcher;

