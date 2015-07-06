/*jslint node: true */
"use strict";

var models = require('../../model');
var config = require('../../../../appconfig.js');

exports.testCreate = function (req, res, next) {
    var testUser = new models.User();
    testUser.email = config.testuseremail;
    testUser.password = config.testuserpassword;
    testUser.admin = true;
    testUser.save();
    res.json({message: 'Test User Created', user: testUser});
};

exports.testDelete = function (req, res, next) {
    models.User.remove({_id: req.params.user_id}, function (err, user) {
        res.json({message: 'Test User Deleted'});
    });
};


