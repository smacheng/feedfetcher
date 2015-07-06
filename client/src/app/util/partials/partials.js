(function(module) {
try {
  module = angular.module('PartialTemplates');
} catch (e) {
  module = angular.module('PartialTemplates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/partialsfeed/feeds.tpl.html',
    '<md-list><md-list-item class="md-2-line" ng-repeat="url in feed.feeds"><div class="md-list-item-text"><h3>{{ url.url }}</h3><p>{{ url._id }}</p></div><md-menu><md-button aria-label="Open Feed Interactions Menu" class="md-icon-button" ng-click="$mdOpenMenu(event)"><md-icon md-menu-origin md-svg-icon="edit"></md-icon></md-button><md-menu-content width="2"><md-menu-item><md-button ng-href="/feeds/{{ url._id }}">Edit</md-button></md-menu-item><md-menu-item><md-button class="md-warn" ng-click="feed.deleteFeed(url._id)">Delete</md-button></md-menu-item></md-menu-content></md-menu></md-list-item></md-list>');
}]);
})();

(function(module) {
try {
  module = angular.module('PartialTemplates');
} catch (e) {
  module = angular.module('PartialTemplates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/partialsfeed/singleFeed.tpl.html',
    '<md-content layout="column"><form ng-submit="feed.saveFeed()"><md-input-container><label>URL</label> <input ng-model="feed.feedData.url" type="url"></md-input-container><md-input-container><md-button type="submit" class="md-raised md-primary">Go</md-button></md-input-container></form></md-content>');
}]);
})();

(function(module) {
try {
  module = angular.module('PartialTemplates');
} catch (e) {
  module = angular.module('PartialTemplates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/partialsitem/itemlisting.tpl.html',
    '<div><div><p>{{post.score}}pts</p></div><div><p><a ng-href="{{post.url}}" target="_blank">{{post.title}}</a></p></div><div><i ng-if="post.source === \'Reddit\'"></i> <i ng-if="post.source === \'HackerNews\'"></i></div></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('PartialTemplates');
} catch (e) {
  module = angular.module('PartialTemplates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/partialsitem/list.tpl.html',
    '<div ng-if="item.processing" class="fade" layout="row" layout-align="center center"><md-progress-circular class="md-hue-2" md-mode="indeterminate"></md-progress-circular></div><md-list><md-list-item class="md-2-line" dir-paginate="post in item.items | itemsPerPage: 20" total-items="item.totalItems" current-page="item.currentPage" ng-href="post.url"><div class="md-list-item-text" id="{{post._id}}"><h3 ng-if="post.source === \'Reddit\'">Reddit</h3><h3 ng-if="post.source === \'HackerNews\'">Hacker News</h3><p>{{post.title}}</p></div><md-icon ng-if="main.loggedIn && item.type == \'all\'" md-svg-icon="favorite" ng-class="{\'md-primary\' : post.saved}" ng-click="item.toggleSaved(post)"></md-icon><md-icon ng-if="main.loggedIn && item.type == \'saved\'" md-svg-icon="favorite" ng-class="{\'md-primary\' : post.saved}" ng-click="item.toggleSaved(post)"></md-icon></md-list-item></md-list><dir-pagination-controls on-page-change="item.pageChanged(newPageNumber)"></dir-pagination-controls>');
}]);
})();

(function(module) {
try {
  module = angular.module('PartialTemplates');
} catch (e) {
  module = angular.module('PartialTemplates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/partialsmain/navbar.tpl.html',
    '<md-sidenav class="site-sidenav md-sidenav-left md-whiteframe-z2" md-component-id="left" md-is-locked-open="$mdMedia(\'gt-sm\')"><md-toolbar class="nav-header"><h1>FeedFetcher</h1></md-toolbar><md-list><md-list-item><md-button class="md-primary nav-item">All</md-button></md-list-item><md-list-item ng-if="!main.loggedIn" class="fade"><md-button class="md-primary nav-item">Login</md-button></md-list-item><md-list-item ng-if="main.loggedIn" class="fade"><md-button class="md-primary nav-item">Search</md-button></md-list-item><md-list-item ng-if="main.loggedIn" class="fade"><md-button class="md-primary nav-item">Saved</md-button></md-list-item><md-list-item ng-if="main.loggedIn" class="fade"><md-button class="md-primary nav-item">Feeds</md-button></md-list-item><md-list-item class="fade" ng-if="main.loggedIn"><md-button ng-click="main.doLogout()" class="md-primary nav-item">Logout</md-button></md-list-item></md-list></md-sidenav>');
}]);
})();

(function(module) {
try {
  module = angular.module('PartialTemplates');
} catch (e) {
  module = angular.module('PartialTemplates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/partialslogin/login.tpl.html',
    '<md-content layout-padding layout="column" layout-align="center center"><form ng-submit="login.doLogin()"><md-input-container><label>Email</label> <input ng-model="login.loginData.email" type="email"></md-input-container><md-input-container><label>Password</label> <input ng-model="login.loginData.password" type="password"></md-input-container><md-input-container><md-button type="submit" class="md-raised md-primary">Login</md-button></md-input-container></form></md-content>');
}]);
})();

(function(module) {
try {
  module = angular.module('PartialTemplates');
} catch (e) {
  module = angular.module('PartialTemplates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/partialssearch/search.tpl.html',
    '<md-content layout="column"><form ng-submit="search.search()"><md-input-container><label>URL</label> <input ng-model="search.searchData.parameter" type="text"></md-input-container><md-input-container><md-button type="submit" class="md-raised md-primary">Go</md-button></md-input-container></form><div ng-if="search.processing" class="fade" layout="row" layout-align="center center"><md-progress-circular class="md-hue-2" md-mode="indeterminate"></md-progress-circular></div><md-list><md-list-item class="md-2-line" ng-repeat="post in search.items"><div class="md-list-item-text" id="{{post._id}}"><h3 ng-if="post.source === \'Reddit\'">Reddit</h3><h3 ng-if="post.source === \'HackerNews\'">Hacker News</h3><p>{{post.title}}</p></div><md-icon md-svg-icon="favorite" ng-class="{\'md-primary\' : post.saved}" ng-click="search.save(post)"></md-icon></md-list-item></md-list></md-content>');
}]);
})();

(function(module) {
try {
  module = angular.module('PartialTemplates');
} catch (e) {
  module = angular.module('PartialTemplates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/partialsutil/paginate/dirPagination.tpl.html',
    '<div layout="row" class="pagination" ng-if="1 < pages.length"><md-button class="md-fab" aria-label="Go Back a Page" ng-disabled="pagination.current == 1" ng-click="pageBack()"><md-icon md-svg-icon="arrow_back"></md-icon></md-button><md-button class="md-fab" aria-label="Go Forward a Page" ng-disabled="pagination.current == pagination.last" ng-click="pageForward()"><md-icon md-svg-icon="arrow_forward"></md-icon></md-button></div>');
}]);
})();
