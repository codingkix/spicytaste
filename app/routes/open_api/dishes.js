var express = require('express');
var router = express.Router();
var Dish = require('../../models/dish');
var Comment = require('../../models/comment');

// on routes that end in /api/dishes
// ----------------------------------------------------
//get all dishes and order by createDate desc(GET http://localhost:5050/api/dishes)

router.get('/dishes', function(req, res, next) {
    'use strict';
    var query = Dish.find().sort('-createdDate');

    //search by tags
    if (req.query.tags) {
        var tags = req.query.tags;
        var id = req.query.id;
        query.ne('_id', id).where('tags').in(tags);
    }

    //limit the result
    if (req.query.limit) {
        var n = req.query.limit;
        query.limit(n);
    }

    query.exec(function(err, dishes) {
        if (err) {
            return next(err);
        }
        res.status(200).json(dishes);
    });
});


// on routes that end in /api/dishes/:dish_id
// ----------------------------------------------------
router.get('/dishes/:dish_id', function(req, res, next) {
    'use strict';
    console.log('dish query by id', req.params.dish_id);

    var query = Dish.findById(req.params.dish_id);
    query.populate('comments instructions').exec(function(err, dish) {
        if (err) {
            console.log('dish query err', err);
            return next(err);
        }
        if (!dish) {
            return next({
                message: 'dish not found.',
                status: 404
            });
        }

        if (dish.comments.length > 0) {
            Comment.populate(dish.comments, {
                path: 'author replyTo'
            }, function(err, data) {
                res.status(200).send(dish);
            });
        } else {
            res.status(200).send(dish);
        }

    });
});


module.exports = router;
