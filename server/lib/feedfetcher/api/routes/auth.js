/**
 * Created by michaelfisher on 7/1/15.
 */
var User = require('../../model/user.js');
var jwt = require('jsonwebtoken');

exports.authorize = function (req, res, next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    //    Decode token
    if (token) {
        jwt.verify(token, config.feedfetcherSecret, function (err, decoded) {
            // Token authentication failed, return message/403
            if (err) {
                res.sendStatus(403).json({
                    success: false,
                    message: 'Failed to authenticate token'
                });
            } else {
                //    All good, save to request for use in other routes
                req.decoded = decoded;

                next(); // go to next route.
            }
        })
    } else {
        //    No token
        res.sendStatus(403).json({
            success: false,
            message: 'No token provided'
        });
    }
};

exports.authenticate = function (req, res, next) {
    // find the user
    User.findOne({
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
                    name: user.name,
                    email: user.email
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