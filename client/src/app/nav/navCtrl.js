/**
 * Created by michaelfisher on 7/4/15.
 */
(function () {
    angular.module('navCtrl', [])
        .controller('NavigationController', function ($location) {
            var vm = this;

            vm.isActive = function (viewLocation) {
                return viewLocation === $location.path();
            };
        });
})();