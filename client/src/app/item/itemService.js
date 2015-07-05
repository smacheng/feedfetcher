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
            itemFactory.getSavedPage = function (pageNumber) {
                return $http.get('/api/saved/page/' + pageNumber);
            };

            itemFactory.saveItem = function (saveData) {
                return $http.post('/api/saved', saveData);
            };

            itemFactory.removeSavedItem = function (itemId) {
                return $http.delete('/api/saved/' + itemId);
            };

            return itemFactory;
        });
})();