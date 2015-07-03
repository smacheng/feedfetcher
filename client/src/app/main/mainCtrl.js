/**
 * Created by michaelfisher on 6/28/15.
 */
(function () {
    angular.module('mainCtrl', [])
        .controller('MainController', function ($rootScope, $location, $mdSidenav, Auth) {
            var vm = this;

            //    Find out if logged in
            vm.loggedIn = Auth.isLoggedIn();
            // Check to see if a user is logged in on every request
            $rootScope.$on('$routeChangeStart', function () {
                vm.loggedIn = Auth.isLoggedIn();

                //    Get user information on route change
                Auth.getUser()
                    .success(function (data) {
                        vm.user = data;
                    });
            });

            //    Handle logging out
            vm.doLogout = function () {
                Auth.logout();
                //     Reset all user info
                vm.user = {};
                vm.loggedIn = false;
                $location.path('/');
            };

            vm.toggleNav = function () {
              $mdSidenav('left').toggle();

            };

        })
        .directive('navBar', function () {
            return {
                restrict: 'E',
                templateUrl: 'app/main/navbar.tpl.html'
            };
        });
})();