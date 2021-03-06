/*jslint node: true */
"use strict";
/**
 * Created by michaelfisher on 7/1/15.
 */
var models = require('../../model');
var jwt = require('jsonwebtoken');
var config = require('../../../../appconfig.js');

/**
 * Middleware that protects routes that perform CUD operations on DB
 * TODO:  Potential code duplication (saved.js also checks tokens).  Evaluate whether or not this should be moved into a separate function.
 * @param req
 * @param res
 * @param next
 */

exports.authorize = function (req, res, next) {
    // Grab the token from where-ever it is
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    //    Decode token
    if (token) {
        jwt.verify(token, config.feedfetcherSecret, function (err, decoded) {
            // Token authentication failed, return message/403
            if (err) {
                res.status(403).json({
                    success: false,
                    message: 'Failed to authenticate token'
                });
            } else {
                //    All good, save to request for use in other routes
                req.decoded = decoded;

                next(); // go to next route.
            }
        });
    } else {
        //    No token
        res.status(403).json({
            success: false,
            message: 'No token provided'
        });
    }
};

/**
 * Auth POST route
 * POST /api/authenticate
 * Validates a user's credentials, configures a JWT for future usage.
 * @param req
 * @param res
 * @param next
 */
exports.authenticate = function (req, res, next) {
    // find the user
    models.User.findOne({
        email: req.body.email
    }).select('name username password').exec(function (err, user) {

        if (err) throw err;

        // no user with that username was found
        if (!user) {
            res.json({
                success: false,
                message: 'Authentication failed. User not found.'
            });
        } else if (user) {

            // check if password matches
            var validPassword = user.comparePassword(req.body.password);
            if (!validPassword) {
                res.json({
                    success: false,
                    message: 'Authentication failed. Wrong password.'
                });
            } else {

                // if user is found and password is right
                // create a token
                var token = jwt.sign({
                    id: user._id
                }, config.feedfetcherSecret, {
                    expiresInMinutes: 1440 // expires in 24 hours
                });

                // return the information including token as JSON
                res.json({
                    success: true,
                    message: 'Enjoy your token!',
                    token: token
                });
            }

        }

    });
};

exports.me = function (req, res, next) {
    res.send(req.decoded);
};