var express = require('express');
var router = express.Router();
var User = require('../../models/user');
var jwt = require('jwt-simple');
var config = require('../../../config');
var bcrypt = require('bcrypt');

//get current login user
router.get('/users/me', function(req, res) {

    if (!req.headers['x-auth']) {
        console.log(req.headers['x-auth']);
        res.sendStatus(401);
    }

    var auth = jwt.decode(req.headers['x-auth'], config.secret);
    console.log("decoded auth: ", auth);

    User.findOne({
        email: auth.email
    }, function(err, user) {
        if (err) return res.send(err);

        res.json(user);
    });
});

//get user by email
router.get('/users/:user_email', function(req, res) {
    User.findOne({
        email: req.params.user_email
    }, function(err, user) {
        if (err) return res.send(err);

        if (!user) {
            res.json({
                success: false
            });
        } else {
            res.json({
                success: true,
                user: user
            });
        }
    });
});

//save a new user
router.post('/users', function(req, res) {
    var user = new User({
        email: req.body.email,
        linkedSocial: req.body.social
    });
    bcrypt.hash(req.body.password, 10, function(err, hash) {
        if (err) {
            return res.send(err);
        }
        user.password = hash;
        user.save(function(err) {
            if (err) {
                return res.send(err);
            }

            res.sendStatus(201);
        })
    })
});

//update existing user
//add linked social for now
router.put('/users/:user_id', function(req, res) {
    User.findById({
        email: req.params.user_id
    }, function(err, user) {
        if (err) return res.send(err);

        if (!user) {
            res.json({
                success: false,
                message: 'no user is found.'
            });
        } else {
            user.linkedSocial = req.body.linkedSocial;
            user.save(function(err) {
                if (err) return res.send(err);

                res.json({
                    success: true,
                    user: user
                });
            });
        }
    });
})

module.exports = router;
