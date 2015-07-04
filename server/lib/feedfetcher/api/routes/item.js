/**
 * Created by michaelfisher on 7/1/15.
 */
var model = require('../../model');
var jwt = require('jsonwebtoken');
var config = require('../../../../appconfig.js');
var _ = require('underscore');
var async = require('async');

// Todo:  make this async waterfall
exports.page = function (req, res) {
    model.Item.paginate({}, {
        page: req.params.page, limit: 20
    }, function (err, results, pageCount, itemCount) {
        if (err) res.send(err);

        var token = req.body.token || req.query.token || req.headers['x-access-token'];

        if (token) {
            processLoggedInResults(results, token, function () {
                res.json({itemCount: itemCount, items: results});
            })
        } else {
            for (i = 0; i < results.length; i++) {
                var item = results[i];
                delete item.savedBy;
                item.saved = false;
            }
            res.json({itemCount: itemCount, items: results});
        }
    });
};

var processLoggedInResults = function (results, token, cb) {
    async.waterfall([
        function (next) {
            jwt.verify(token, config.feedfetcherSecret, function (err, decoded) {
                next(err, decoded);
            });
        },
        function (decoded, next) {
            model.User.findById(decoded.id, function (err, user) {
                next(err, decoded, user);
            });
        },
        function (decoded, user, next) {
            var userIdString = user._id.toString();
            for (i = 0; i < results.length; i++) {
                var item = results[i];
                if (_.contains(item.savedBy, userIdString)) {
                    item.saved = true;
                }
                delete item.savedBy;
            }
            next();
        },
        function (next) {
            next(null, null);
        }
    ], cb);
};
