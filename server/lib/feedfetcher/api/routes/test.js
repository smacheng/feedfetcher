/**
 * Created by michaelfisher on 6/21/15.
 */
/*jslint node: true */
"use strict";
var config = require('../../../../appconfig');
var User = require('../../model/user');

/**
 * Create a user for tests
 * @param req
 * @param res
 * @param next
 */
exports.create = function (req, res, next) {
    req.models.User.findOne({'email': config.testuseremail}, function (error, user) {
        if (!user) {
            var testUser = new User();

            testUser.email = config.testuseremail;
            testUser.password = config.testuserpassword;
            testUser.admin = true;
            testUser.save();
            return res.json({'creation': true});
        } else {
            return res.json({'creation': false});
        }
    });
};

/**
 * Delete a user for tests
 * @param req
 * @param res
 * @param next
 */
exports.delete = function (req, res, next) {
    req.models.User.findOne({'email': config.testuseremail}, function (error, user) {
        if (!user) {
            return res.json({'deletion': false});
        } else {
            user.remove(function (error, doc) {
                if (error) return next(error);
                res.json({'deletion': true});
            });
        }
    });
};