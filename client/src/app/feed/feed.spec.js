/**
 * Created by michaelfisher on 7/7/15.
 */
describe('feedCtrl', function () {
    var httpMock, $controller, controller;

    beforeEach(function () {
        module('feedCtrl');
        module('feedService');
    });

    beforeEach(inject(function (_$controller_, $httpBackend) {
        var mockFeeds = {
            "feeds": [
                {
                    "_id": "5594a5b728cef46e0a069098",
                    "url": "http://www.reddit.com/.json"
                },
                {
                    "_id": "5594a5b728cef46e0a069099",
                    "url": "https://hacker-news.firebaseio.com/v0/topstories.json"
                }
            ]
        };
        var mockSingleFeed = {
            "feed": {
                "_id": "5594a5b728cef46e0a069098",
                "url": "http://www.reddit.com/.json"
            }
        };
        $controller = _$controller_;
        httpMock = $httpBackend;
        // feedFactory.all
        httpMock.when('GET', '/api/feeds').respond(mockFeeds);
        // feedFactory.get
        httpMock.when('GET', '/api/feeds/1').respond(mockSingleFeed);
        // feedFactory.add
        httpMock.when('POST', '/api/feeds').respond({
            message: 'Feed added!'
        });
        httpMock.when('PUT', '/api/feeds/1').respond({
            message: 'Feed updated!'
        });
        // feedFactory.delete
        httpMock.when('DELETE', '/api/feeds/1').respond(mockFeeds);

    }));


    describe('FeedController', function () {
        beforeEach(function () {
            controller = $controller('FeedController');
        });

        it('should return feeds', function () {
            httpMock.expectGET('/api/feeds');
            expect(controller.feeds).not.toBeUndefined();
            expect(controller.processing).toBe(true);
            httpMock.flush();
            expect(controller.feeds.length).toBeGreaterThan(0);
            expect(controller.processing).toBe(false);
        });

        it('should call the delete function', function () {
            httpMock.expectDELETE('/api/feeds/1');
            controller.deleteFeed(1);
            expect(controller.feeds).not.toBeUndefined();
            httpMock.flush();
            expect(controller.processing).toBe(false);
        });
    });

    describe('FeedCreateController', function () {
        beforeEach(function () {
            controller = $controller('FeedCreateController');
        });

        it('should start out with a type of create and with no message', function () {
            expect(controller.type).toEqual('create');
            expect(controller.message).toEqual('');
            expect(controller.processing).toBe(false);
        });

        it('should add a feed', function () {
            httpMock.expectPOST('/api/feeds');
            controller.saveFeed();
            expect(controller.processing).toBe(true);
            expect(controller.message).toEqual('');
            httpMock.flush();
            expect(controller.message).toEqual('Feed added!');
            expect(controller.feedData).toEqual({});
            expect(controller.processing).toBe(false);
        });
    });

    describe('FeedEditController', function () {
        var $routeParams;
        beforeEach(function () {
            controller = $controller('FeedEditController', {$routeParams: {feed_id: '1'}});
        });

        it('should start be of type edit, have no message, and grab a feed', function () {
            httpMock.expectGET('/api/feeds/1');
            expect(controller.type).toEqual('edit');
            expect(controller.message).toEqual('');
            expect(controller.processing).toBe(false);
            httpMock.flush();
        });

        it('should add a feed', function () {
            httpMock.expectPUT('/api/feeds/1');
            controller.saveFeed();
            expect(controller.processing).toBe(true);
            expect(controller.message).toEqual('');
            httpMock.flush();
            expect(controller.message).toEqual('Feed updated!');
            expect(controller.feedData).toEqual({});
            expect(controller.processing).toBe(false);
        });
    });
});