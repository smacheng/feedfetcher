/**
 * Created by michaelfisher on 6/28/15.
 */
(function () {
    angular.module('app.routes', ['ngRoute'])
        .config(function ($routeProvider, $locationProvider) {
            $routeProvider
                //    Home Route (Feed listing)
                .when('/', {
                    templateUrl: 'app/item/list.tpl.html',
                    controller: 'ItemController',
                    controllerAs: 'item'
                })
                // Route for viewing all feeds
                .when('/feeds', {
                    templateUrl: 'app/feed/feeds.tpl.html',
                    controller: 'FeedController',
                    controllerAs: 'feed'
                })
                // Route for Creating a new Feed
                .when('/feeds/create', {
                    templateUrl: 'app/feed/singlefeed.tpl.html',
                    controller: 'FeedCreateController',
                    controllerAs: 'feed'
                })
                // Route for editing a feed
                .when('/feeds/:feed_id', {
                    templateUrl: 'app/feed/singlefeed.tpl.html',
                    controller: 'FeedEditController',
                    controllerAs: 'feed'
                });
            //    Clean up URL using HTML5 History API
            $locationProvider.html5Mode(true);
        });
})();