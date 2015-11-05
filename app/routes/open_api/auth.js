var express = require('express');
var router = express.Router();
var User = require('../../models/user');
var jwt = require('jsonwebtoken');
var config = require('../../../config');
var bcrypt = require('bcrypt');

router.post('/auth', function(req, res, next) {
    'use strict';
    User.findOne({
        email: req.body.email
    }, 'password email', function(err, user) {
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
        if (user.password !== config.defaultPassword) {
            bcrypt.compare(req.body.password, user.password, function(err, valid) {
                if (err) {
                    return res.send(err);
                }
                if (!valid) {
                    res.status(404).json({
                        message: 'wrong password.'
                    });
                }

                var token = jwt.sign({
                    userId: user._id
                }, config.secret, {
                    expiresInMinutes: 1440
                });

                res.status(200).json({
                    token: token,
                    userId: user._id
                });

            });
        } else {
            var token = jwt.sign({
                userId: user._id
            }, config.secret, {
                expiresInMinutes: 1440
            });

            res.status(200).json({
                token: token,
                userId: user._id
            });
        }

    });
});

module.exports = router;
