/**
 * Created by michaelfisher on 6/30/15.
 */
(function () {
    angular.module('itemCtrl', ['itemService', 'smoothScroll'])
        // Full listing controller
        .controller('ItemController', function (Item, smoothScroll, Auth, $rootScope) {
            var vm = this;
            // Setup for pagination
            vm.totalItems = 0;
            vm.itemsPerPage = 10;
            vm.currentPage = 1;
            // Connect to itemService, get a specific page

            vm.loggedIn = Auth.isLoggedIn();
            // Check to see if a user is logged in on every request
            $rootScope.$on('$routeChangeStart', function () {
                vm.loggedIn = Auth.isLoggedIn();
            });

            vm.getResultsPage = function (pageNumber) {
                vm.processing = true;
                Item.getPage(pageNumber)
                    .success(function (data) {
                        vm.currentPage = pageNumber;
                        vm.items = data.items;
                        vm.totalItems = data.itemCount;
                        vm.processing = false;
                    });
            };

            // Get first page at load
            vm.getResultsPage(1);
            // Gets next page of results
            vm.pageChanged = function (newPage) {
                vm.getResultsPage(newPage);
            };

            vm.save = function (item) {
                // todo:  flatten this promise chain
                Auth.getUserId()
                    .success(function (data) {
                        Item.saveItem({
                            user_id: data.id,
                            item_id: item._id
                        })
                            .success(function (data) {
                                item.saved = true;
                            });
                    });
            };
        })
        .controller('SavedItemController', function (Item) {
            var vm = this;
            vm.totalItems = 0;
            vm.itemsPerPage = 10;
            vm.currentPage = 1;

        })
        // Directive for <item-listing> tag
        .directive('itemListing', function () {
            return {
                restrict: 'E',
                templateUrl: 'app/item/itemlisting.tpl.html'
            };
        });


})();