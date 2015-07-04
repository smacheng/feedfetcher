/**
 * Created by michaelfisher on 7/3/15.
 */

var models = require('../../model');
var async = require('async');
var _ = require('underscore');

/**
 * Build list of results of saved items.
 * @param req
 * @param res
 */
exports.page = function (req, res) {
    models.User.pagination({_id: req.params.id}, {
        page: req.params.newPageNumber,
        limit: 20,
        populate: 'savedItems'
    }, function (error, results, pageCount, itemCount) {
        if (error) res.send(error);
        res.json({itemCount: itemCount, items: results});
    });
};
/**
 * Asynchronous method to:
 * - Grab the User by ID
 * - Grab an Item by ID
 * - Generate a new saved item
 * - Configure it appropriately
 * - Resave the original item so the UI can show that it is saved.
 * @param userId
 * @param itemId
 * @param cb
 */
var saveItem = function (userId, itemId, cb) {
    async.waterfall([
        function (next) {
            models.User.findById(userId, function (err, user) {
                console.log(user);
                next(err, user);
            });
        },
        function (user, next) {
            models.Item.findById(itemId, function (err, item) {
                next(err, user, item);
            });
        },
        function (user, item, next) {
            // Create a new saved item, give it the information from the original item and the User's ID as a ref

            var savedItem = new models.SavedItem({
                url: item.url,
                title: item.title,
                score: item.score,
                posted: item.posted,
                source: item.source
            });

            savedItem.save(function (err, savedItem) {
                next(err, user, item, savedItem);
            });
        },
        function (user, item, savedItem, next) {
            if (!_.contains(user.savedItems, savedItem._id)) {
                user.savedItems.push(savedItem._id)
            }
            user.save(function (err, user) {
                next(err, user, item, savedItem);
            })
        },
        function (user, item, savedItem, next) {
            // Now we need to tell the item that it is saved, so that it appears in the results appropriately
            if (!_.contains(item.savedBy, user._id)) {
                item.savedBy.push(user._id);
            }
            item.save(function (err, item) {
                next(err, item);
            });
        },
        function (item, next) {
            // All done, proceed in the callback chain
            next(null, item);
        }
    ], cb);
};

/**
 * Save the item to the user's saved items.
 * @param req
 * @param res
 */
exports.save = function (req, res) {
    console.log(req.body.user_id);
    console.log(req.body.item_id);
    saveItem(req.body.user_id, req.body.item_id, function (error, item) {
        if (error) {
            console.log(error);
            res.send(error);
        } else {
            res.json({success: true});
        }
    })
};