/**
 * Created by michaelfisher on 7/1/15.
 */
/*jslint node: true */
"use strict";
var model = require('../../model');
var jwt = require('jsonwebtoken');
var config = require('../../../../appconfig.js');
var _ = require('underscore');
var async = require('async');

/**
 * Item GET Route
 * GET /api/all/page/:page
 *
 * Returns a subset of results from Mongo
 * @param req
 * @param res
 */
exports.page = function (req, res) {
    model.Item.paginate({}, {
        page: req.params.page, limit: 20
    }, function (err, results, pageCount, itemCount) {
        if (err) res.send(err);

        var token = req.body.token || req.query.token || req.headers['x-access-token'];

        if (token) {
            // We have a token, so now we need to check if the user has saved a particular post in the response
            processLoggedInResults(results, token, function () {
                // Processing complete, return the response
                res.json({itemCount: itemCount, items: results});
            });
        } else {
            // No token, so no results can be saved.
            // Loop through the items, sanitize the response
            for (var i = 0; i < results.length; i++) {
                results[i] = results[i].toObject();
                var item = results[i];
                // It could be argued that User ID's are not sensitive, as they are randomized
                // But we're already doing operations on the items, so the overhead is minimal
                delete item.savedBy;
                item.saved = true;
            }
            res.json({itemCount: itemCount, items: results});
        }
    });
};

/**
 * Takes a set of results from the database, finds the logged in user, and discovers whether or not a user has saved a particular post
 * @param results
 * @param token
 * @param cb
 */
var processLoggedInResults = function (results, token, cb) {
    async.waterfall([
        function (next) {
            jwt.verify(token, config.feedfetcherSecret, function (err, decoded) {
                // Passes the decoded token along to next function
                next(err, decoded);
            });
        },
        function (decoded, next) {
            // Use the decoded token to find a user by ID
            model.User.findById(decoded.id, function (err, user) {
                next(err, decoded, user);
            });
        },
        function (decoded, user, next) {
            // Convert it to a regular String
            var userIdString = user._id.toString();
            // Loop through the results
            for (var i = 0; i < results.length; i++) {
                // Convert them to standard Objects
                results[i] = results[i].toObject();
                var item = results[i];
                // Check if the User ID is contained inside of the item's savedBy
                if (_.contains(item.savedBy, userIdString)) {
                    item.saved = true;
                }
                // Sanitize the item from user ID's
                delete item.savedBy;
            }
            next();
        },
        function (next) {
            // No need for a return value from the function overall.
            next(null, null);
        }
    ], cb);
};
