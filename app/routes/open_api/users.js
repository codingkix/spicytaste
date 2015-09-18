var express = require('express');
var router = express.Router();
var User = require('../../models/user');
var bcrypt = require('bcrypt');

//search user by field
router.get('/users', function(req, res, next) {

    if (Object.keys(req.query).length === 0) {
        res.status(403).json('query is denied.');
    }

    var query = User.find({});

    //search by email
    if (req.query.email) {
        query.where('email').regex(new RegExp(req.query.email));
    }

    query.exec(function(err, users) {
        if (err) return next(err);

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

//save a new user
router.post('/users', function(req, res, next) {
    var user = new User({
        userName: req.body.userName,
        email: req.body.email,
        photoUrl: req.body.photoUrl,
        linkedSocial: req.body.linkedSocial
    });
    bcrypt.hash(req.body.password, 10, function(err, hash) {
        if (err) {
            return next(err);
        }
        user.password = hash;
        user.save(function(err) {
            if (err) {
                return next(err);
            }

            res.sendStatus(201);
        });
    });
});

//get user by id
router.get('/users/:user_id', function(req, res, next) {
    var query = User.findById(req.params.user_id);
    query.populate('favouriteDishes').exec(function(err, user) {
        if (err) {
            return next(err);
        }
        res.status(200).send(user);
    });
});

module.exports = router;
