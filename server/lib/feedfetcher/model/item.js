/**
 * Created by michaelfisher on 6/27/15.
 */
var mongoose = require('mongoose');
var mongoosePaginate = require('../lib/mongoose-paginate.js');

var itemSchema = new mongoose.Schema({
    // ID coming from external source
    _externalID: {
        type: String,
        unique: true
    },
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
    // Added to Mongo at this time.
    createdAt: {
        type: Date
    },
    // Reddit or HN (for now)
    source: {
        type: String
    },
    // For reporting to the UI that this item is saved.
    savedBy: [{
        type: String
    }]
});

// List all items (unpaginated)
itemSchema.statics.list = function (callback) {
    this.find({}, null, {sort: {score: -1}}, callback);
};

// Add pagination plugin
itemSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Item', itemSchema);