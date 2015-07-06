/**
 * Created by michaelfisher on 6/21/15.
 */

var app = require('../app'),
    expect = require('expect.js'),
    config = require('../appconfig'),
    request = require('supertest'),
    agent = request.agent(app);

// For use by the various tests
// API response for /all/page/1
var items;
// Test user
var testUser;
// Token returned by API
var token;
// Feed to be created
var feed = {
    url: 'http://www.test.com'
};
// Feed returned by API
var createdFeed;

describe('Server', function () {
// Authorization
//    Make sure it denies access to all routes that require authorization
    describe('Route Protection', function () {
        it('Should deny access to protected routes - GET /api/me', function (done) {
            agent
                .get('/api/me')
                .expect(403, done);
        });
        it('Should deny access to protected routes - POST /api/feeds', function (done) {

            agent
                .post('/api/feeds')
                .expect(403, done);
        });
        it('Should deny access to protected routes - PUT /api/feeds/:feed_id', function (done) {

            agent
                .put('/api/feeds/1111111')
                .expect(403, done);
        });

        it('Should deny access to protected routes - DELETE /api/feeds/:feed_id', function (done) {

            agent
                .delete('/api/feeds/111111')
                .expect(403, done);
        });

        it('Should deny access to protected routes - GET /api/search/:search_params', function (done) {

            agent
                .get('/api/search/888888')
                .expect(403, done);
        });

        it('Should deny access to protected routes - POST /api/search', function (done) {

            agent
                .post('/api/search')
                .expect(403, done);
        });

        it('Should deny access to protected routes - GET /api/saved/page/:page_number', function (done) {

            agent
                .get('/api/saved/page/1')
                .expect(403, done);
        });

        it('Should deny access to protected routes - POST /api/saved', function (done) {

            agent
                .post('/api/saved')
                .expect(403, done);
        });

        it('Should deny access to protected routes - DELETE /api/saved/:item_id', function (done) {

            agent
                .delete('/api/saved/1')
                .expect(403, done);
        });

        it('Should deny access to protected routes - GET /api/fetch', function (done) {

            agent
                .get('/api/fetch')
                .expect(403, done);
        });
    });
//    Public API
    describe('Public Routes', function () {
        //    Allows access to public resources (/all and /login)
        it('Should return a page of results', function (done) {
            agent.get('/api/all/page/1')
                .end(function (err, res) {
                    expect(res.status).to.eql(200);
                    expect(err).to.be(null);
                    expect(res.body.itemCount).to.be.a('number');
                    expect(res.body.items).to.be.an('array');
                    expect(res.body.items).to.not.be.empty();
                    items = res.body.items;
                    done();
                });
        });
//    Redirects garbage URLs to front end
        describe('Route Redirection', function () {
            it('Should redirect garbage URLs to front end - GET /api/super', function (done) {
                agent.get('/api/super')
                    .expect(302, done);
            });
            it('Should redirect garbage URLs to front end - POST /api/nodejs', function (done) {
                agent.post('/api/nodejs')
                    .expect(302, done);
            });
            it('Should redirect garbage URLs to front end - PUT /api/serch', function (done) {
                agent.put('/api/serch')
                    .expect(302, done);
            });
            it('Should redirect garbage URLs to front end - DELETE /api/savid', function (done) {
                agent.delete('/api/savid')
                    .expect(302, done);
            });
            it('Should redirect garbage URLs to front end - GET /api/fid', function (done) {
                agent.get('/api/super')
                    .expect(302, done);
            });
        });
//    Test user creation
//    Creates a user
        describe('Test User Creation', function () {
            it('Should create a test user', function (done) {
                agent.get('/api/test')
                    .end(function (err, res) {
                        expect(err).to.be(null);
                        expect(res.status).to.eql(200);
                        expect(res.body.message).to.eql('Test User Created');
                        expect(res.body.user).to.not.be(undefined);
                        testUser = res.body.user;
                        done();
                    });
            });
        });
    });
    describe('Authenticated Routes', function () {
//    Authenticates
        describe('Authentication', function () {
            it('Should authenticate and deliver a token', function (done) {
                agent.post('/api/authenticate')
                    .send({email: config.testuseremail, password: config.testuserpassword})
                    .end(function (err, res) {
                        expect(err).to.be(null);
                        expect(res.status).to.eql(200);
                        expect(res.body.success).to.eql(true);
                        expect(res.body.message).to.equal('Enjoy your token!');
                        expect(res.body.token).to.not.be(null);
                        token = res.body.token;
                        done();
                    });
            });
        });
//    Gets user info from /me
        describe('User information', function () {
            it('Should Decode a user ID from a token', function (done) {
                agent.get('/api/me')
                    .set('x-access-token', token)
                    .end(function (err, res) {
                        expect(err).to.be(null);
                        expect(res.status).to.eql(200);
                        expect(res.body.id).to.eql(testUser._id);
                        done();
                    });
            });
        });
//    Grab first item from Items
//    Save the item
        describe('Save an item', function () {
            it('should save an item', function (done) {
                var item = items[0];
                agent.post('/api/saved')
                    .set('x-access-token', token)
                    .send({item_id: item._id})
                    .end(function (err, res) {
                        expect(err).to.be(null);
                        expect(res.status).to.eql(200);
                        expect(res.body.success).to.eql(true);
                        done();
                    });
            });
        });
//    Get the items saved by the user
        describe('Retrieve users saved items', function (done) {
            it('should retrieve an item', function (done) {
                agent.get('/api/saved/page/1')
                    .set('x-access-token', token)
                    .end(function (err, res) {
                        expect(err).to.be(null);
                        expect(res.status).to.eql(200);
                        expect(res.body.itemCount).to.eql(1);
                        expect(res.body.items).to.be.an('array');
                        expect(res.body.items).to.not.be.empty();
                        expect(res.body.items[0]._externalID).to.eql(items[0]._externalID);
                        done();
                    });
            });
        });
//    Remove the saved item
        describe('remove a saved item', function () {
            it('should remove an item', function (done) {

                agent.delete('/api/saved/' + items[0]._id)
                    .set('x-access-token', token)
                    .end(function (err, res) {
                        expect(err).to.be(null);
                        expect(res.status).to.eql(200);
                        expect(res.body.deleted).to.eql(true);
                        done();
                    });
            });
        });
//    Adds a feed
        describe('Feeds', function () {
            it('should add a feed', function (done) {
            agent.post('/api/feeds')
                .set('x-access-token', token)
                .send(feed)
                .end(function (err, res) {
                    expect(err).to.be(null);
                    expect(res.status).to.eql(200);
                    expect(res.body.message).to.eql('Feed added!');
                    expect(res.body.feed.url).to.eql(feed.url);
                    createdFeed = res.body.feed;
                    expect(createdFeed).to.not.be(undefined);
                    done();
                });
            });

            it('should find a feed by ID', function (done) {
                agent.get('/api/feeds/'+createdFeed._id)
                    .set('x-access-token', token)
                    .end(function (err, res) {
                        expect(err).to.be(null);
                        expect(res.status).to.eql(200);
                        expect(res.body.feed._id).to.eql(createdFeed._id);
                        expect(res.body.feed.url).to.eql(feed.url);
                        done();
                    });
            });

            it('should update a feed', function (done) {
                createdFeed.url = 'http://www.test2.com';
                agent.put('/api/feeds/'+createdFeed._id)
                    .set('x-access-token', token)
                    .send(createdFeed)
                    .end(function (err, res) {
                        expect(err).to.be(null);
                        expect(res.status).to.eql(200);
                        expect(res.body.feed._id).to.eql(createdFeed._id);
                        expect(res.body.feed.url).to.eql(createdFeed.url);
                        done();
                    });
            });

            it('should find an updated feed by ID', function (done) {
                agent.get('/api/feeds/'+createdFeed._id)
                    .set('x-access-token', token)
                    .end(function (err, res) {
                        expect(err).to.be(null);
                        expect(res.status).to.eql(200);
                        expect(res.body.feed._id).to.eql(createdFeed._id);
                        expect(res.body.feed.url).to.eql(createdFeed.url);
                        done();
                    });
            });

            it('should remove a feed', function (done) {
                agent.delete('/api/feeds/' + createdFeed._id)
                    .set('x-access-token', token)
                    .end(function (err, res) {
                        expect(err).to.be(null);
                        expect(res.status).to.eql(200);
                        expect(res.body.message).to.eql('Feed deleted');
                        expect(res.body.feeds).to.be.an('array');
                        expect(res.body.feeds).to.not.be.empty();
                        done();
                    });
            });
        });
//    Fetches new posts
        describe('Forced fetching', function () {
            it('should refresh when called', function (done) {
                agent.get('/api/fetch')
                    .set('x-access-token', token)
                    .end(function (err, res) {
                        expect(err).to.be(null);
                        expect(res.status).to.eql(200);
                        expect(res.body.message).to.eql('refreshing');
                        done();
                    });
            });
        });
//    Deletes the user
        describe('Test user deletion', function () {
            it('Should delete a test user', function (done) {
                agent.delete('/api/test/' + testUser._id)
                    .set('x-access-token', token)
                    .end(function (err, res) {
                        expect(res.status).to.eql(200);
                        expect(res.body.message).to.eql('Test User Deleted');
                        done();
                    });
            });
        });
    });
});