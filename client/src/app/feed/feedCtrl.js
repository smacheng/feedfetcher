/**
 * Created by michaelfisher on 6/28/15.
 */
(function () {
    angular.module('feedCtrl', ['feedService'])
        // Controller to display the list of feeds
        .controller('FeedController', function (Feed) {
            var vm = this;
            vm.feeds = [];
            vm.processing = true;

            //    Grab all the feeds at load
            Feed.all()
                .success(function (data) {
                    vm.processing = false;
                    vm.feeds = data.feeds;
                });

            vm.deleteFeed = function (id) {
                vm.processing = true;
                //    Accepts feed id as parameter
                Feed.delete(id)
                    .success(function (data) {
                        vm.processing = false;
                        vm.feeds = data.feeds;
                    });
            };
        })
        // Controller applied to feed creation page
        .controller('FeedCreateController', function (Feed) {
            var vm = this;
            //    Variable to show/hide elements of the view
            //    Differentiates between create or edit pages
            vm.type = 'create';
            vm.message = '';
            vm.processing = false;
            //    Function to create a feed
            vm.saveFeed = function () {
                vm.processing = true;
                //    Clear the message
                vm.message = '';

                //    Use the add function in the feedService
                Feed.add(vm.feedData)
                    .success(function (data) {
                        vm.processing = false;
                        //    Clear the form
                        vm.feedData = {};
                        vm.message = data.message;
                    });
            };
        })
//    Controller applied to feed edit page
        .controller('FeedEditController', function ($routeParams, Feed) {
            var vm = this;
            vm.message = '';
            //     Variable to show/hide elements of the view
            //    Differentiates between create or edit pages
            vm.type = 'edit';
            vm.processing = false;

            //    Get feed data using the $routeParams
            Feed.get($routeParams.feed_id)
                .success(function (data) {
                    vm.feedData = data;
                });

            //    Function to save the feed
            vm.saveFeed = function () {
                vm.processing = true;
                vm.message = '';
                // Call FeedService to update
                Feed.update($routeParams.feed_id, vm.feedData)
                    .success(function (data) {
                        vm.processing = false;
                        //    Clear the form
                        vm.feedData = {};
                        //    Bind the message from API to vm.message
                        vm.message = data.message;
                    });
            };
        });
})();