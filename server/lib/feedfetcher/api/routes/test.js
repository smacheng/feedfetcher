/*jslint node: true */
"use strict";

var models = require('../../model');
var config = require('../../../../appconfig.js');

exports.testUserCreate = function (req, res, next) {
    var testUser = new models.User();
    testUser.email = config.testuseremail;
    testUser.password = config.testuserpassword;
    testUser.admin = true;
    testUser.save();
    // Seeds database with at least one item

    res.json({message: 'Test User Created', user: testUser});
};

exports.testItemCreate = function (req, res, next) {
    var testItem = new models.Item();
    testItem._externalID = '1234';
    testItem.url = 'http://www.test.com';
    testItem.title = 'Test';
    testItem.score = '1';
    testItem.posted = Date.now();
    testItem.createdAt = Date.now();
    testItem.source = 'Reddit';
    testItem.savedBy = [];
    testItem.save();

    res.json({message: 'Seed item created', item: testItem});
};

exports.testItemDelete = function (req, res, next) {
    models.Item.remove({_id: req.params.item_id}, function (err, item) {
        if (err) {
            res.send(err);
        } else {
            res.json({message: 'Seed item deleted'});
        }
    })
};

exports.testUserDelete = function (req, res, next) {
    models.User.remove({_id: req.params.user_id}, function (err, user) {
        if (err) {
            res.send(err)
        } else {
            res.json({message: 'Test User Deleted'});
        }
    });
};


