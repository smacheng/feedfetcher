/**
 * Created by michaelfisher on 6/27/15.
 */
var mongoose = require('mongoose');

// Create Schema
var feedSchema = new mongoose.Schema({
    // The URL that will eventually be fetched.
    // Connecting to this URL should return a JSON Response
    url: String
});

feedSchema.static({
    // List all feeds.
    list: function (callback) {
        this.find({}, null, {sort: {_id: -1}}, callback);
    }
});

module.exports = mongoose.model('Feed', feedSchema);