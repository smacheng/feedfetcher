/**
 * Created by michaelfisher on 6/28/15.
 */

var model = require('./model');
var request = require('superagent');

var Parser = {};

/**
 * Takes a JSON response from a feed, checks if it is from HN or Reddit, processes it appropriately.
 * @param response
 */
Parser.processResponse = function (response) {
    var posts = JSON.parse(response.text);
    // if the post has a data property, we know it's a reddit post
    if (posts.data) {
        // Drill down into response to get the data we actually care about
        var array = posts.data.children;
        processRedditResponse(array);
    } else {
        // HN API returns item id's in an array.  Need to walk the tree to get the actual items.
        fetchHackerNewsPost(posts);
    }
    //load into mongo
};
/**
 * Loop through an array of reddit posts
 * @param redditResponseArray
 */
var processRedditResponse = function (redditResponseArray) {
    for (i = 0; i < redditResponseArray.length; i++) {
        processRedditPost(redditResponseArray[i].data);
    }
};

/**
 * Normalizes Reddit Posts into Mongo
 * @param redditPost
 */
var processRedditPost = function (redditPost) {
    if (redditPost) {
        var externalID = redditPost.id;
        // Convert from Unix Time (in seconds) to milliseconds
        var postedTime = new Date(redditPost.created * 1000).toISOString();
        var item = {
            url: redditPost.url,
            title: redditPost.title,
            score: redditPost.score,
            posted: postedTime,
            source: 'Reddit',
            createdAt: Date.now(),
            saved: false
        };
        // Checks if an item with the _externalID exists.  If it does, updates, if not, creates it.
        model.Item.update({_externalID: externalID}, item, {upsert: true}, function (err, itemResponse) {
            // TODO:  Better error handling
            if (err) console.log(err);
        });
    }
};

/**
 * Walks an array of HN Item ID's, grabs the actual item
 * @param hnResponseArray
 */
var fetchHackerNewsPost = function (hnResponseArray) {
    for (i = 0; i < hnResponseArray.length; i++) {
        var urlString = 'https://hacker-news.firebaseio.com/v0/item/' + hnResponseArray[i] + '.json?print=pretty';
        request.get(urlString)
            .end(function (error, res) {
                if (error) console.log(error);
                processHackerNewsPost(res);
            })
    }
};

/**
 * Normalizes a JSON object from HN's API into Mongo
 * @param hnItemResponse
 */
var processHackerNewsPost = function (hnItemResponse) {
    if (hnItemResponse) {
        var hnPost = JSON.parse(hnItemResponse.text);
        if (hnPost) {
            var externalID = hnPost.id;
            // Similar to Reddit, the response is Unix Time in Seconds.  Converts to milliseconds
            var postedTime = new Date(hnPost.time * 1000).toISOString();
            var item = {
                // If an item in Hacker News is not an external link (e.g. Ask HN), the url property is empty.
                // We still want to be able to link to something, so this links to the HN comment thread itself
                url: hnPost.url ? hnPost.url : 'https://news.ycombinator.com/item?id=' + externalID,
                title: hnPost.title,
                score: hnPost.score,
                posted: postedTime,
                source: 'HackerNews',
                createdAt: Date.now(),
                saved: false
            };
            model.Item.update({_externalID: externalID}, item, {upsert: true}, function (err, itemResponse) {
                if (err) console.log(err);
            });
        }
    }
};

module.exports = Parser;