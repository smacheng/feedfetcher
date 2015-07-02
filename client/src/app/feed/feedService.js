/**
 * Created by michaelfisher on 6/28/15.
 */
(function () {
    angular.module('feedService', [])
        .factory('Feed', function ($http) {
            //    Create a new object
            var feedFactory = {};

            // Get all feeds
            feedFactory.all = function () {
                return $http.get('/feedfetcher/api/feeds');
            };

            // Get feed by ID
            feedFactory.get = function (id) {
                return $http.get('/feedfetcher/api/feeds/' + id);
            };

            // Add a feed
            feedFactory.add = function (feedData) {
                return $http.post('/feedfetcher/api/feeds', feedData);
            };

            // Update a feed
            feedFactory.update = function (id, feedData) {
                return $http.put('/feedfetcher/api/feeds/' + id, feedData);
            };

            // Delete a feed
            feedFactory.delete = function (id) {
                return $http.delete('/feedfetcher/api/feeds/' + id);
            };

            return feedFactory;
        });
})();