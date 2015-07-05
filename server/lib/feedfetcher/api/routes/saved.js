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
    models.User.findById(req.decoded.id).exec(function (err, user) {
        if (err) {
            res.send(err);
        } else {
            models.SavedItem.paginate({
                    _id: {$in: user.savedItems}
                }, {page: req.params.page_number, limit: 20},
                function (err, results, pageCount, itemCount) {
                    if (err) {
                        res.send(err);
                    } else {
                        res.json({itemCount: itemCount, items: results});
                    }
                });
        }
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
                originalId: item._id,
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
            // Sanity check to make sure the the user's saved items don't already contain the ID.
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
    saveItem(req.decoded.id, req.body.item_id, function (error, item) {
        if (error) {
            console.log(error);
            res.send(error);
        } else {
            res.json({success: true});
        }
    })
};
/**
 * Asynchronous function to:
 * - Remove a saved item from mongo
 * - Remove it from a user's saved item ref's
 * - Remove the references to the user in the item's saved by history
 * TODO:  This is fine for now, as it works, but it does not scale past one user.  Investigate whether or not sub-docs will be a better option for saving items.
 * @param userId
 * @param itemId
 * @param cb
 */
var deleteSavedItem = function (userId, itemId, cb) {
    async.waterfall([
        function (next) {
            //    Find and Delete the document with the originalID
            models.SavedItem.remove({
                originalId: itemId
            }, function (err, savedItem) {
                next(err, savedItem);
            })
        },
        function (savedItem, next) {
            models.User.findById(userId, function (err, user) {
                next(err, savedItem, user)
            })
        },
        function (savedItem, user, next) {
            var idIndex = user.savedItems.indexOf(savedItem._id);
            user.savedItems.splice(idIndex, 1);
            user.save(function (err, user) {
                next(err);
            })
        },
        function (next) {
            //    Now go into the regular items, find the item with that id
            models.Item.findById(itemId, function (err, item) {
                next(err, item);
            })
        },
        function (item, next) {
            //    Remove the user id from that item's savedBy
            var idIndex = item.savedBy.indexOf(userId);
            item.savedBy.splice(idIndex, 1);
            //    Save the item
            item.save(function (err, item) {
                next(err, item);
            })
        },
        function (item, next) {
            next(null, item);
        }
    ], cb);
};

exports.delete = function (req, res) {
    deleteSavedItem(req.decoded.id, req.params.item_id, function (error, item) {
        if (error) {
            console.log(error);
            res.send(error);
        } else {
            res.json({deleted: true});
        }
    })
};