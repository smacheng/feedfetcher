/**
 * Created by michaelfisher on 6/28/15.
 */
(function () {
    var feedApp = angular.module('feedApp', [
//    Add animations
        'ngAnimate',
//    App routes
        'app.routes',
//        Service for login/logout/auth
        'authService',
//    Service for connecting to feed API
        'feedService',
        // Controller for main page
        'mainCtrl',
//    Controller for feed creation
        'feedCtrl',
        // Controller for item listing
        'itemCtrl',
        //    Service for getting items from API
        'itemService',
        //    Pagination
        'angularUtils.directives.dirPagination'
    ])
        .config(function ($httpProvider) {
            //    Attach auth interceptor to the http requests
            $httpProvider.interceptors.push('AuthInterceptor');
        });
})();