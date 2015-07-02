/**
 * Created by michaelfisher on 6/28/15.
 */
(function () {
    angular.module('mainCtrl', [])
        .controller('MainController', function ($rootScope, $location, Auth) {
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

            //    Handle login form
            vm.doLogin = function () {
                vm.loginProcessing = true;
                //    Call the Auth.login() function
                Auth.login(vm.loginData.email, vm.loginData.password)
                    .success(function (data) {
                        vm.loginProcessing = false;
                        vm.loggedIn = true;
                        if (!data.success) {
                            vm.error = data.message;
                        }
                    });
            };

            //    Handle logging out
            vm.doLogout = function () {
                Auth.logout();
                //     Reset all user info
                vm.user = {};
                vm.loggedIn = false;
            }
        })
        .directive('mainFooter', function () {
            return {
                restrict: 'E',
                templateUrl: 'app/views/partials/mainfooter.html'
            }
        })
        .directive('navBar', function () {
            return {
                restrict: 'E',
                templateUrl: 'app/views/partials/navbar.html'
            }
        });
})();