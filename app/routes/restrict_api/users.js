var express = require('express');
var router = express.Router();
var User = require('../../models/user');
var Dish = require('../../models/dish');
var jwt = require('jsonwebtoken');
var config = require('../../../config');

//get current login user
router.get('/me', function(req, res) {
    var auth = jwt.verify(req.headers['x-auth'], config.secret);
    res.send(auth.userId);
});

//update user
router.put('/users/:user_id', function(req, res, next) {
    User.findById(req.params.user_id, function(err, user) {
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

});

//save dish as favorite
router.put('/users/:user_id/dishes/:dish_id', function(req, res, next) {
    var query = User.findById(user_id);
    query.populate('favouriteDishes').exec(function(err, user) {
        if (err) {
            return next(err);
        }

        //if user already have it, return true
        user.favouriteDishes.forEach(function(item) {
            if (item._id === req.params.dish_id)
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
    });

});

module.exports = router;
