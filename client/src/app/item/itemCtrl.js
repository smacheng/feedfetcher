/**
 * Created by michaelfisher on 6/30/15.
 */
(function () {
    angular.module('itemCtrl', ['itemService', 'smoothScroll'])
        // Full listing controller
        .controller('ItemController', function (Item, smoothScroll) {
            var vm = this;
            // Setup for pagination
            vm.totalItems = 0;
            vm.itemsPerPage = 10;
            vm.currentPage = 1;
            // Connect to itemService, get a specific page
            vm.getResultsPage = function (pageNumber) {
                vm.processing = true;
                Item.getPage(pageNumber)
                    .success(function (data) {
                        vm.currentPage = pageNumber;
                        vm.processing = false;
                        vm.items = data.items;
                        vm.totalItems = data.itemCount;
                    });
            };

            // Get first page at load
            vm.getResultsPage(1);
            // Gets next page of results
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