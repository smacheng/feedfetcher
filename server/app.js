/**
 * Created by michaelfisher on 6/18/15.
 */
/*jslint node: true */
"use strict";
// ==================================================================================
// Setup ============================================================================
// ==================================================================================

// ExpressJS, for routing
var express = require('express'),
// Allows us to run app as module for testing
    http = require('http'),
// Path for file manipulation
    path = require('path'),
// Mongoose for interacting with Mongo
    mongoose = require('mongoose'),
// Config file giving us defaults
    config = require('./appconfig'),
// Connect Mongoose to Mongo
    db = mongoose.connect(config.database, {safe: true}),
    feedFetcher = require('./lib/feedfetcher');

// Configures the first user
// invoked with --setup
var argv = require('minimist')(process.argv.slice(2));
if (argv.setup) {
    var User = require('./lib/feedfetcher/model/user.js');
    var adminUser = new User();
    adminUser.email = config.email;
    adminUser.password = config.password;
    adminUser.admin = true;
    adminUser.save();
    console.log('Initial User Created.');
}


feedFetcher.init();
// ==================================================================================
// Express middleware Setup =========================================================
// ==================================================================================

// Logs server events to console
var logger = require('morgan'),
// Allows interaction/parsing of header cookies
    cookieParser = require('cookie-parser'),
// Parses response bodies
    bodyParser = require('body-parser');

// Set up the app
var app = express();
// Exports for use by Mocha
module.exports = app;
// Enables serving of static files
// Invoked with --development
if (argv.development) {
    var browserSync = require('browser-sync');
    var bs = browserSync({logSnippet: false});
    app.use(require('connect-browser-sync')(bs));
    app.use(express.static(__dirname + '/build-dev'));
}

// configure our app to handle CORS requests
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
});

// ================================================================================
// Express.js middleware configuration ============================================
// ================================================================================

// Express.js configuration
app.set('port', config.port);

// Morgan now logs every request
app.use(logger('dev'));
// Configurate bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
// Tell cookieParser our secret
app.use(cookieParser(config.cookieSecret));

// ================================================================================
// Routes =========================================================================
// ================================================================================

app.use('/api', feedFetcher.api(app, express, feedFetcher));

// Catch all route ===============================================================
// If in development, enables redirecting users to front-end
if (argv.development) {
    app.all('*', function (req, res) {
        res.sendFile(path.join(__dirname + '/build-dev/index.html'));
    });
} else {
    app.all('*', function (req, res) {
        res.redirect('/');
    });
}

var server = http.createServer(app);
var boot = function () {
    server.listen(app.get('port'), function () {
        console.info('Feedfetcher is listening on port ' + app.get('port'));
    });
};

var shutdown = function () {
    feedFetcher.invalidateTimers();
    server.close(function () {
        console.log('closed');
    });
};

if (require.main === module) {
    boot();
} else {
    console.info('Running Feedfetcher as a module');
    module.exports.boot = boot;
    module.exports.shutdown = shutdown;
    module.exports.port = app.get('port');
}

