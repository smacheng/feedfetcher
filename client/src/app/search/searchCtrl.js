/**
 * Created by michaelfisher on 7/5/15.
 */
(function () {
    angular.module('searchCtrl', ['searchService'])
        .controller('SearchController', function (Search) {
            var vm = this;

            vm.search = function () {
                vm.processing = true;
                vm.items = {};
                console.log(vm.searchData.parameter);
                Search.search(vm.searchData.parameter)
                    .success(function (data) {
                        vm.processing = false;
                        vm.items = data.results;
                    })
            };
        });
})();