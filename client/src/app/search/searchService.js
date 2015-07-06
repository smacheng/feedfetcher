/**
 * Created by michaelfisher on 7/5/15.
 */
(function () {
    angular.module('searchService', [])
        .factory('Search', function ($http, $q) {
            //    Create a new object
            var searchFactory = {};

            searchFactory.search = function (params) {
                return $http.get('/api/search/' + params);
            };

            return searchFactory;
        });
})();