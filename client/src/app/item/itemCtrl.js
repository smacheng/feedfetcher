/**
 * Created by michaelfisher on 6/30/15.
 */
(function () {
    angular.module('itemCtrl', ['itemService'])
        // Full listing controller
        .controller('ItemController', function (Item) {
            var vm = this;
            // Setup for pagination
            vm.totalItems = 0;
            vm.itemsPerPage = 10;
            vm.currentPage = 1;
            vm.type = 'all';
            vm.processing = false;
            // Connect to itemService, get a specific page

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