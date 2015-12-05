var express = require('express');
var router = express.Router();
var User = require('../../models/user');
var jwt = require('jsonwebtoken');
var config = require('../../../config');
var bcrypt = require('bcrypt');
var utils = require('../../utils');

router.post('/auth/facebook', function(req, res, next) {
    'use strict';
    var fbUser = req.body;
    User.findOne({
        'facebook.id': fbUser.facebook.id
    }, function(err, user) {
        if (err) {
            return next(err);
        }
        if (!user) {
            user = new User(fbUser);
            user.role = utils.roles.reader;
        }

        user.lastLogin = Date.now();

        user.save(function(err, user) {
            if (err) {
                return next(err);
            }

            var token = jwt.sign({
                userId: user._id
            }, config.secret, {
                expiresInMinutes: 1440
            });

            res.status(200).json({
                token: token,
                user: user
            });
        });
    });
});

router.post('/auth', function(req, res, next) {
    'use strict';
    User.findOne({
        email: req.body.email
    }).select('+password').exec(function(err, user) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'user not found.'
            });
        }
        //only compare encrypted password when user login with email/password
        bcrypt.compare(req.body.password, user.password, function(err, valid) {
            if (err) {
                return next(err);
            }
            if (!valid) {
                res.status(404).json({
                    message: 'wrong password.'
                });
            }

            user.lastLogin = Date.now();

            user.save(function(err, user) {
                if (err) {
                    return next(err);
                }

                var token = jwt.sign({
                    userId: user._id
                }, config.secret, {
                    expiresInMinutes: 1440
                });
                user.password = undefined;
                res.status(200).json({
                    token: token,
                    user: user
                });
            });

        });

    });
});

module.exports = router;
