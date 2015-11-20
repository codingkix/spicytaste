var express = require('express');
var router = express.Router();
var User = require('../../models/user');
var bcrypt = require('bcrypt');
var utils = require('../../utils');

//search user by field
router.get('/users', function(req, res, next) {
    'use strict';

    if (Object.keys(req.query).length === 0) {
        res.status(403).json('query is denied.');
    }

    var query = User.find({});

    //search by email
    if (req.query.email) {
        query.where('email').regex(new RegExp(req.query.email, 'i'));
    }

    query.exec(function(err, users) {
        if (err) {
            next(err);
        }

        if (!users) {
            res.json({
                success: false
            });
        } else {
            res.json({
                success: true,
                users: users
            });
        }
    });
});

//create a new user
router.post('/users', function(req, res, next) {
    'use strict';
    var user = new User(req.body);
    bcrypt.hash(req.body.password, 10, function(err, hash) {
        if (err) {
            return next(err);
        }
        user.password = hash;
        user.role = utils.roles.reader;
        user.lastLogin = Date.now();

        user.save(function(err) {
            if (err) {
                return next(err);
            }

            res.sendStatus(201);
        });
    });
});

//get user by id
router.get('/users/:userId', function(req, res, next) {
    'use strict';
    User.findById(req.params.userId).exec(function(err, user) {
        if (err) {
            return next(err);
        }
        res.status(200).send(user);
    });
});

module.exports = router;
