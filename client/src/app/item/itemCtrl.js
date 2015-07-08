/**
 * Created by michaelfisher on 6/30/15.
 */
(function () {
    angular.module('itemCtrl', ['itemService'])
        // Full listing controller
        .controller('ItemController', function (Item, $window, $routeParams, $location) {
            var vm = this;
            // Setup for pagination
            vm.totalItems = 0;
            vm.itemsPerPage = 10;
            vm.currentPage = $routeParams.page_number ? $routeParams.page_number : 1;
            vm.totalPages = 1;
            vm.type = 'all';
            vm.processing = false;
            // Connect to itemService, get a specific page

            vm.onFirstPage = function () {
                return vm.currentPage === 1;
            };

            vm.onLastPage = function () {
                return vm.totalPages === vm.currentPage;
            };

            vm.getResultsPage = function (pageNumber) {
                vm.processing = true;
                Item.getPage(pageNumber)
                    .success(function (data) {
                        vm.currentPage = pageNumber;
                        vm.items = data.items;
                        vm.totalItems = data.itemCount;
                        vm.totalPages = data.pageCount;
                        vm.processing = false;
                    });
            };

            // Get first page at load
            vm.getResultsPage(vm.currentPage);
            // Gets next page of results
            vm.pageForward = function () {
                vm.currentPage++;
                $location.path('/all/page/' + vm.currentPage);
            };

            vm.pageBackward = function () {
                vm.currentPage--;
                $location.path('/all/page/' + vm.currentPage);
            };

            vm.openLink = function (url) {
                $window.open(url, '_blank');
            };

            vm.toggleSaved = function (item) {
                // todo:  evaluate moving this into a service
                if (item.saved) {
                    Item.removeSavedItem(item._id)
                        .success(function (data) {
                            item.saved = false;
                        });
                } else {
                    Item.saveItem({
                        item_id: item._id
                    })
                        .success(function (data) {
                            item.saved = true;
                        });
                }
            };
        })
        .controller('SavedItemController', function (Auth, Item) {
            var vm = this;
            vm.totalItems = 0;
            vm.itemsPerPage = 10;
            vm.currentPage = 1;
            vm.type = 'saved';
            vm.getResultsPage = function (pageNumber) {
                vm.processing = true;
                Item.getSavedPage(pageNumber)
                    .success(function (data) {
                        vm.totalItems = data.itemCount;
                        vm.items = data.items;
                        vm.currentPage = pageNumber;
                        vm.processing = false;
                    });
            };

            vm.toggleSaved = function (item) {
                if (item.saved) {
                    Item.removeSavedItem(item._id)
                        .success(function (data) {
                            indexOfItem = vm.items.indexOf(item);
                            vm.items.splice(indexOfItem, 1);
                        });
                }
            };

            vm.getResultsPage(1);
            vm.pageChanged = function (newPage) {
                vm.getResultsPage(newPage);
            };
        })
        // Directive for <item-listing> tag
        .directive('itemListing', function () {
            return {
                restrict: 'E',
                templateUrl: 'app/item/itemlisting.tpl.html'
            };
        });


})();