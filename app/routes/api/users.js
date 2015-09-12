var express = require('express');
var router = express.Router();
var User = require('../../models/user');
var Dish = require('../../models/dish');
var jwt = require('jwt-simple');
var config = require('../../../config');
var bcrypt = require('bcrypt');

//get user by id
router.param('user_id', function(req, res, next, user_id) {
    var query = User.findById(user_id);
    query.populate('favouriteDishes').exec(function(err, user) {
        if (err) return next(err);
        req.user = user;
        return next();
    });
});

//get current login user
router.get('/users/me', function(req, res, next) {

    if (!req.headers['x-auth']) {
        res.sendStatus(401);
    }

    var auth = jwt.decode(req.headers['x-auth'], config.secret);

    User.findOne({
        email: auth.email
    }).populate('favouriteDishes').exec(function(err, user) {
        if (err) return next(err);
        res.json(user);
    });
});

//search user by field
router.get('/users', function(req, res, next) {
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
        })
    })
});

router.route('/users/:user_id')
    .get(function(req, res) {
        res.json(req.user);
    })
    //update existing user
    //add linked social for now
    .put(function(req, res, next) {
        var user = req.user;
        if (!user) {
            res.json({
                success: false,
                message: 'no user is found.'
            });
        } else {
            user.userName = req.body.userName;
            user.photoUrl = req.body.photoUrl;
            user.linkedSocial = req.body.linkedSocial;
            user.save(function(err) {
                if (err) return next(err);

                res.json({
                    success: true,
                    user: user
                });
            });
        }
    });

//save dish as favorite
router.put('/users/:user_id/dishes/:dish_id', function(req, res, next) {
    var user = req.user;
    //if user already have it, return true
    user.favouriteDishes.forEach(function(item) {
        if (item._id == req.params.dish_id)
            return res.json({
                success: true
            });
    });

    Dish.findById(req.params.dish_id).exec(function(err, dish) {
        if (err) next(err);
        if (dish) {
            user.favouriteDishes.push(dish);
            user.save(function(err, user) {
                if (err) return next(err);
                res.json({
                    success: true
                });
            });
        }
    });

})

module.exports = router;
