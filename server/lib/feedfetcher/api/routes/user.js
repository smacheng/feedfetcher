/**
 * Created by michaelfisher on 6/18/15.
 */

/**
 * GET users listing
 * @param req
 * @param res
 */
exports.list = function (req, res) {
    res.send('respond with a resource');
};

/**
 * GET Login page
 * @param req
 * @param res
 * @param next
 */
exports.login = function (req, res, next) {
    res.render('login', {admin: req.session.admin});
};

/**
 * GET Logout route.
 * @param req
 * @param res
 * @param next
 */
exports.logout = function (req, res, next) {
    req.session.destroy();
    res.redirect('/');
};

/**
 * POST authenticate route
 * @param req
 * @param res
 * @param next
 * @returns {String}
 */
exports.authenticate = function (req, res, next) {
    if (!req.body.email || !req.body.password) {
        return res.render('login', {error: 'Please enter your email and password'});
    }
    req.models.User.findOne({
        email: req.body.email
    }).select('email password admin').exec(function (error, user) {
        if (error) return next(error);

        if (!user) {
            return res.render('login', {error: 'User not found'});
        } else if (user) {
            var validPassword = user.comparePassword(req.body.password);
            if (!validPassword) {
                return res.render('login', {error: 'Password does not match'});
            } else {
                req.session.user = user;
                req.session.admin = user.admin;
                res.redirect('/admin');
            }
        }
    })
};

/**
 * GET user POST page
 * @param req
 * @param res
 * @param next
 */
exports.add = function (req, res, next) {
    if (!req.body.email) {
        var titleText = title + 'new user';
        res.write(userTemplateFn({
            titleText: titleText,
            admin: req.session.admin
        }));
        res.end();
    }
};

/**
 * POST user POST page
 * @param req
 * @param res
 * @param next
 */
exports.addUser = function (req, res, next) {
    if (!req.body.email || !req.body.password || !req.body.admin) {
        var titleText = title + 'new user';
        res.write(userTemplateFn({
            titleText: titleText,
            error: 'Fill email, password, and admin',
            admin: req.session.admin
        }));
        res.end();
    } else {
        var user = {
            email: req.body.email,
            password: req.body.password,
            admin: req.body.admin
        };
        req.models.User.create(user, function (error, userResponse) {
            if (error) return next(error);
            res.write(userTemplateFn({
                titleText: titleText,
                error: 'User was added!',
                admin: req.session.admin,
                user: userResponse
            }));
            res.end();
        });
    }
};

/**
 * GET user PUT page
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
exports.edit = function (req, res, next) {
    if (!req.params.id) return next(new Error('No user ID'));
    req.models.User.findById(req.params.id, function (error, user) {
        if (error) return next(error);
        if (!user) return next(new Error('User not found'));
        var titleText = title + 'edit user';
        res.write(userTemplateFn({
            titleText: titleText,
            user: user,
            admin: req.session.admin
        }));
        res.end();
    });
};

/**
 * PUT user PUT page
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
exports.editUser = function (req, res, next) {
    if (!req.params.id) return next(new Error('No user ID'));
    req.models.User.findById(req.params.id, function (error, user) {
        if (error) return next(error);
        if (!user) return next(new Error('User not found'));
        var titleText = title + 'edit user';
        user.email = req.body.email;
        user.password = req.body.password;
        user.admin = req.body.admin;

        user.save();
        res.write(userTemplateFn({
            titleText: titleText,
            user: user,
            error: 'User was updated!',
            admin: req.session.admin
        }));
        res.end();
    });
};

/**
 * PUT user PUT API Route
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
exports.put = function (req, res, next) {
    if (!req.params.id) return next(new Error('No user ID.'));
    req.models.User.findById(
        req.params.id,
        function (error, user) {
            if (error) return next(error);
            user.update({$set: req.body.user}, function (error, count, raw) {
                if (error) return next(error);
                res.send({affectedCount: count});
            });
        });
};

/**
 * Delete user API Route
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
exports.del = function (req, res, next) {
    if (!req.params.id) return next(new Error('No user ID.'));
    req.models.User.findById(req.params.id, function (error, user) {
        if (error) return next(error);
        if (!user) return next(new Error('User not found.'));
        user.remove(function (error, doc) {
            if (error) return next(error);
            res.json({deletedUser: doc});
        });
    });
};


/**
 * Allows creation of initial user
 */
/*
 exports.setup = function (req, res, next) {
 req.models.User.findOne({'email': config.email}, function (error, user) {
 if (!user) {
 var User = require('../models/user');
 var firstUser = new User();

 firstUser.email = config.email;
 firstUser.password = config.password;
 firstUser.admin = config.admin;
 firstUser.save();
 return next();
 } else {
 return next();
 }
 })
 };
 */