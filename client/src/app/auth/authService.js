/**
 * Created by michaelfisher on 6/29/15.
 */
angular.module('authService', [])
// Factory for handling tokens
// Inject $window to store token client-side
    .factory('AuthToken', function ($window) {
        var authTokenFactory = {};

        //    Get the token out of local storage
        authTokenFactory.getToken = function () {
            return $window.localStorage.getItem('token');
        };

        //    Set or clear token
        authTokenFactory.setToken = function (token) {
            if (token) {
                $window.localStorage.setItem('token', token);
            } else {
                $window.localStorage.removeItem('token');
            }
        };

        return authTokenFactory;
    })
//    Auth factory to login and get informatio
    .factory('Auth', function ($http, $q, AuthToken) {
        var authFactory = {};

        //    Log a user in
        authFactory.login = function (email, password) {
            return $http.post('/feedfetcher/api/authenticate', {
                email: email,
                password: password
            })
                .success(function (data) {
                    AuthToken.setToken(data.token);
                    return data;
                });
        };

        //    Log a user out by clearing a token
        authFactory.logout = function () {
            //    Clear the token
            AuthToken.setToken();
        };

        //    Check if a user is logged in
        authFactory.isLoggedIn = function () {
            if (AuthToken.getToken()) {
                return true;
            } else {
                return false;
            }
        };

        //    Get the logged in user
        authFactory.getUser = function () {
            if (AuthToken.getToken()) {
                return $http.get('/feedfetcher/api/me', {cache: true})
            } else {
                return $q.reject({message: 'User has no token.'});
            }
        };

        return authFactory;
    })
    .factory('AuthInterceptor', function ($q, $location, AuthToken) {
        var interceptorFactory = {};
        // Happens on all requests
        interceptorFactory.request = function (config) {
            var token = AuthToken.getToken();

            //    If the token exists, add it to the header as x-access-token
            if (token) {
                config.headers['x-access-token'] = token;
            }
            return config;
        };

        //    Happens on response errors
        interceptorFactory.responseError = function (response) {
            //    If the server returns a 403 forbidden
            if (response.status === 403) {
                AuthToken.setToken();
                $location.path('/login');
            }

            //    Return the errors from the server as a promise
            return $q.reject(response);
        };

        return interceptorFactory;
    });