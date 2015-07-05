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
//        Login Controller
        'loginCtrl',
//    Controller for feed creation
        'feedCtrl',
        // Controller for item listing
        'itemCtrl',
        //    Service for getting items from API
        'itemService',
        'navCtrl',
        //    Pagination
        'angularUtils.directives.dirPagination',
        // Dependency for ngMaterial
        'ngAria',
        // Material design directives
        'ngMaterial',
        // partial templates
        'PartialTemplates'
    ])
        .config(function ($httpProvider, $mdThemingProvider, $mdIconProvider, paginationTemplateProvider) {
            //    Attach auth interceptor to the http requests
            $httpProvider.interceptors.push('AuthInterceptor');
            $mdThemingProvider.theme('default')
                .primaryPalette('blue')
                .accentPalette('orange');
            paginationTemplateProvider.setPath('app/util/paginate/dirPagination.tpl.html');
            $mdIconProvider.icon('menu', './assets/images/svg/menu_24.svg', 24)
                .icon('arrow_back', './assets/images/svg/arrow_back_48.svg', 48)
                .icon('delete', './assets/images/svg/delete_48.svg', 48)
                .icon('edit', './assets/images/svg/edit_48.svg', 48)
                .icon('favorite', './assets/images/svg/favorite_24.svg', 24)
                .icon('arrow_forward', './assets/images/svg/arrow_forward_48.svg', 48);
        });
})();