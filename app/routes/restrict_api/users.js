var express = require('express');
var router = express.Router();
var User = require('../../models/user');
var Dish = require('../../models/dish');

//get current login user
router.get('/me', function(req, res, next) {
    'use strict';

    User.findById(req.decoded.userId, function(err, user) {
        if (err) {
            return next(err);
        }

        return res.status(200).json(user);
    });
});

//get user full profile
router.get('/me/profile', function(req, res, next) {
    'use strict';

    User.findById(req.decoded.userId).populate('favouriteDishes').exec(function(err, user) {
        if (err) {
            next(err);
        }

        Dish.count({
            createdBy: req.decoded.userId
        }, function(err, count) {
            if (err) {
                next(err);
            }
            res.status(200).json({
                user: user,
                reciptsCount: count
            });

        });
    });
});

//get user's recipts
router.get('/users/:userId/recipts', function(req, res, next) {
    'use strict';

    Dish.find({
        createdBy: req.params.userId
    }).sort('-createdDate').exec(function(err, dishes) {
        if (err) {
            next(err);
        }

        res.status(200).send(dishes);

    });
});

//update user
router.put('/users/:userId', function(req, res, next) {
    'use strict';
    User.findById(req.params.userId, function(err, user) {
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
                if (err) {
                    next(err);
                }

                res.json({
                    success: true,
                    user: user
                });
            });
        }
    });

});

//save dish as favorite
router.put('/users/:userId/dishes/:dishId', function(req, res, next) {
    'use strict';
    User.findByIdAndUpdate(req.params.userId, {
        $addToSet: {
            favouriteDishes: req.params.dishId
        }
    }, function(err) {
        if (err) {
            return next(err);
        }

        res.json({
            success: true
        });
    });

});

module.exports = router;
