/**
 * Created by michaelfisher on 7/2/15.
 */
(function () {
    angular.module('loginCtrl', ['authService'])
        .controller('LoginController', function ($location, Auth) {
            var vm = this;
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
                        $location.path('/');
                    });
            };

        });
})();