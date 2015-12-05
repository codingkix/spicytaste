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

//update user specific field
router.put('/users/:userId/field', function(req, res, next) {
    'use strict';
    var updateObj = {};
    console.log('body', req.body);
    updateObj[req.body.field] = req.body.newValue;
    console.log('updateObj', updateObj);

    User.findByIdAndUpdate(req.params.userId, {
        $set: updateObj
    }, function(err) {
        if (err) {
            return next(err);
        }

        res.json({
            success: true
        });
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
