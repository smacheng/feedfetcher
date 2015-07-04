/**
 * Created by michaelfisher on 7/1/15.
 */
var mongoose = require('mongoose');
var mongoosePaginate = require('../lib/mongoose-paginate.js');

var savedItemSchema = new mongoose.Schema({
    // The URL that is linked
    url: {
        type: String
    },
    // Title (will be displayed in list results)
    title: {
        type: String
    },
    // Current score as of fetch time
    score: {
        type: Number
    },
    // The time the item was originally posted
    posted: {
        type: Date
    },
    // Added to Mongo at this time.  This is the TTL property.
    createdAt: {
        type: Date,
        default: Date.now
    },
    // Reddit or HN (for now)
    source: {
        type: String
    }
});

// List all items (unpaginated)
savedItemSchema.statics.list = function (callback) {
    this.find({}, null, {sort: {score: -1}}, callback);
};

// Add pagination plugin
savedItemSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('SavedItem', savedItemSchema);