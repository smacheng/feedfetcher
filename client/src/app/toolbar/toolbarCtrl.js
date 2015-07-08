(function () {
    angular.module('toolbarCtrl', ['ngRoute'])
        .controller('ToolbarController', function ($rootScope, $route) {
            var vm = this;
            vm.title = '';
            $rootScope.$on('$routeChangeSuccess', function () {
                vm.title = $route.current.$$route.label;
            });
        });
})();