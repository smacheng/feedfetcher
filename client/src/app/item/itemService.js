/**
 * Created by michaelfisher on 6/30/15.
 */
(function () {
    angular.module('itemService', [])
        .factory('Item', function ($http) {
            //    Create a new object
            var itemFactory = {};

            //    Get top 15 items
            itemFactory.all = function () {
                return $http.get('/api/all');
            };
            // Get specific page of items
            itemFactory.getPage = function (pageNumber) {
                return $http.get('/api/all/page/' + pageNumber);
            };

            // Get specific page of saved results
            itemFactory.getSavedPage = function (user, pageNumber) {
                return $http.get('/api/' + user._id + '/saved/page/' + pageNumber);
            };

            itemFactory.saveItem = function (saveData) {
                console.log('save item');
                return $http.post('/api/save', saveData);
            };

            itemFactory.getSavedPosts = function (userId) {
                return $http.get('/api/' + user._id + '/saved');
            };

            return itemFactory;
        });
})();