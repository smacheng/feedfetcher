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

            return itemFactory;
        });
})();