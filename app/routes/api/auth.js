var express = require('express');
var router = express.Router();
var User = require('../../models/user');
var jwt = require('jwt-simple');
var config = require('../../../config');
var bcrypt = require('bcrypt');

router.post('/auth', function(req, res, next) {

    User.findOne({
        email: req.body.email
    }, 'password email', function(err, user) {
        if (err) {
            return next(err);
        }

        if (!user) {
            return next({
                message: "user not found.",
                status: 404
            });
        }
        //only compare encrypted password when user login with email/password
        if (user.password != config.defaultPassword) {
            bcrypt.compare(req.body.password, user.password, function(err, valid) {
                if (err)
                    return res.send(err);
                if (!valid) {
                    return next({
                        message: "user not found.",
                        status: 404
                    });
                }

                var token = jwt.encode({
                    email: user.email
                }, config.secret);

                res.send(token);

            });
        } else {
            var token = jwt.encode({
                email: user.email
            }, config.secret);

            res.send(token);
        }

    });
});

module.exports = router;
