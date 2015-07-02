(function (module) {
  try {
    module = angular.module('PartialTemplates');
  } catch (e) {
    module = angular.module('PartialTemplates', []);
  }
  module.run(['$templateCache', function ($templateCache) {
    $templateCache.put('/partialsfeed/feeds.tpl.html',
        '<div class="page-header"><h1><a href="feeds/create" class="btn btn-default"><span class="glyphicon glyphicon-plus"></span> New Feed</a></h1></div><div class="jumbotron text-center" ng-show="feed.processing"><span class="glyphicon glyphicon-repeat spinner"><p>Loading Feeds</p></span></div><table class="table table-bordered table-striped" ng-show="feed.feeds"><thead><tr><th>id</th><th>url</th><th class="col-sm-2"></th></tr></thead><tbody></tbody><tr ng-repeat="url in feed.feeds"><td>{{ url._id }}</td><td>{{ url.url }}</td><td class="col-sm-2"><a class="btn btn-danger" ng-href="feeds/{{ url._id }}">Edit</a> <a href="#" ng-click="feed.deleteFeed(url._id)" class="btn btn-primary">Delete</a></td></tr></table>');
  }]);
})();

(function (module) {
  try {
    module = angular.module('PartialTemplates');
  } catch (e) {
    module = angular.module('PartialTemplates', []);
  }
  module.run(['$templateCache', function ($templateCache) {
    $templateCache.put('/partialsfeed/singleFeed.tpl.html',
        '<div class="page-header"><h1 ng-if="feed.type == \'create\'">Create Feed</h1><h1 ng-if="feed.type == \'edit\'">Edit Feed</h1></div><form class="form-horizontal" ng-submit="feed.saveFeed()"><div class="form-group"><label class="col-sm-2 control-label">URL</label><div class="col-sm-6"><input class="form-control" ng-model="feed.feedData.url"></div></div><div class="form-group"><div class="col-sm-offset-2 col-sm-6"><button class="btn btn-success btn-lg btn-block" ng-if="feed.type ==\'create\'">Create Feed</button> <button class="btn btn-success btn-lg btn-block" ng-if="feed.type == \'edit\'">Update Feed</button></div></div></form><div class="row show-hide-message" ng-show="feed.message"><div class="col-sm-6 col-sm-offset-2"><div class="alert alert-info">{{ feed.message }}</div></div></div>');
  }]);
})();

(function (module) {
  try {
    module = angular.module('PartialTemplates');
  } catch (e) {
    module = angular.module('PartialTemplates', []);
  }
  module.run(['$templateCache', function ($templateCache) {
    $templateCache.put('/partialsitem/itemlisting.tpl.html',
        '<div class="row item"><div class="col-sm-2 score"><p class="score-text">{{post.score}}pts</p></div><div class="col-sm-8 title"><p class="title-text"><a ng-href="{{post.url}}" target="_blank">{{post.title}}</a></p></div><div class="col-sm-2 source"><i class="fa fa-reddit" ng-if="post.source === \'Reddit\'"></i> <i class="fa fa-hacker-news" ng-if="post.source === \'HackerNews\'"></i></div></div>');
  }]);
})();

(function (module) {
  try {
    module = angular.module('PartialTemplates');
  } catch (e) {
    module = angular.module('PartialTemplates', []);
  }
  module.run(['$templateCache', function ($templateCache) {
    $templateCache.put('/partialsitem/list.tpl.html',
        '<div class="jumbotron text-center" ng-show="feed.processing"><span class="glyphicon glyphicon-repeat spinner"><p>Loading Feeds...</p></span></div><div class="text-center"><dir-pagination-controls on-page-change="item.pageChanged(newPageNumber)"></dir-pagination-controls></div><div class="feeds" dir-paginate="post in item.items | itemsPerPage: 10" total-items="item.totalItems" current-page="item.currentPage"><item-listing></item-listing></div>');
  }]);
})();

(function (module) {
  try {
    module = angular.module('PartialTemplates');
  } catch (e) {
    module = angular.module('PartialTemplates', []);
  }
  module.run(['$templateCache', function ($templateCache) {
    $templateCache.put('/partialsmain/mainfooter.tpl.html',
        '<footer><div class="col-xs-6">d</div><div class="col-xs-6">d</div></footer>');
  }]);
})();

(function (module) {
  try {
    module = angular.module('PartialTemplates');
  } catch (e) {
    module = angular.module('PartialTemplates', []);
  }
  module.run(['$templateCache', function ($templateCache) {
    $templateCache.put('/partialsmain/navbar.tpl.html',
        '<header><nav class="navbar navbar-inverse"><div class="container"><div class="navbar-header"><a href="https://mphfish.com" class="navbar-brand">FeedFetcher</a> <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#nav" aria-expanded="false"><span class="sr-only">Toggle Navigation</span> <span class="icon-bar"></span> <span class="icon-bar"></span> <span class="icon-bar"></span></button></div><div class="collapse navbar-collapse" id="nav"><ul class="nav navbar-nav navbar-right"><li><a href="/feedfetcher">all</a></li><li ng-if="!main.loggedIn" class="dropdown"><a href="#" class="dropdown-toggle" data-toggle="dropdown">login</a><div class="dropdown-menu login-dropdown"><form ng-submit="main.doLogin()"><div class="form-group"><label>Email</label> <input type="text" class="form-control" ng-model="main.loginData.email"></div><div class="form-group"><label>Password</label> <input type="password" class="form-control" ng-model="main.loginData.password"></div><div class="alert alert-danger" ng-if="main.error">{{ main.error }}</div><button type="submit" class="btn btn-block btn-primary"><span ng-if="!main.loginProcessing" class="spinner">Login</span> <span ng-if="main.loginProcessing" class="spinner"><span class="glyphicon glyphicon-repeat"></span></span></button></form></div></li><li ng-if="main.loggedIn"><a href="search/">search</a></li><li ng-if="main.loggedIn"><a href="saved/">saved</a></li><li ng-if="main.loggedIn"><a href="feeds/">feeds</a></li><li ng-if="main.loggedIn"><a href="#" ng-click="main.doLogout()">logout</a></li></ul></div></div></nav></header>');
  }]);
})();

(function (module) {
  try {
    module = angular.module('PartialTemplates');
  } catch (e) {
    module = angular.module('PartialTemplates', []);
  }
  module.run(['$templateCache', function ($templateCache) {
    $templateCache.put('/partialsutil/paginate/dirPagination.tpl.html',
        '<ul class="pagination" ng-if="1 < pages.length"><li ng-if="boundaryLinks" ng-class="{ disabled : pagination.current == 1 }"><a href ng-click="setCurrent(1)">&laquo;</a></li><li ng-if="directionLinks" ng-class="{ disabled : pagination.current == 1 }"><a href ng-click="setCurrent(pagination.current - 1)">&lsaquo;</a></li><li ng-repeat="pageNumber in pages track by $index" ng-class="{ active : pagination.current == pageNumber, disabled : pageNumber == \'...\' }"><a href ng-click="setCurrent(pageNumber)">{{ pageNumber }}</a></li><li ng-if="directionLinks" ng-class="{ disabled : pagination.current == pagination.last }"><a href ng-click="setCurrent(pagination.current + 1)">&rsaquo;</a></li><li ng-if="boundaryLinks" ng-class="{ disabled : pagination.current == pagination.last }"><a href ng-click="setCurrent(pagination.last)">&raquo;</a></li></ul>');
  }]);
})();
