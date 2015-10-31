var express = require('express');
var router = express.Router();
var Dish = require('../../models/dish');


// on routes that end in /api/dishes/count
// ----------------------------------------------------
router.get('/dishes/count', function(req, res, next) {
    'use strict';
    Dish.count(req.query, function(err, count) {
        if (err) {
            next(err);
        }

        res.status(200).json(count);
    });
});

// on routes that end in /api/dishes
// ----------------------------------------------------
//get all dishes and order by createDate desc(GET http://localhost:5050/api/dishes)

router.get('/dishes', function(req, res, next) {
    'use strict';
    var query = Dish.find();

    //search by tags
    if (req.query.tags) {
        var tags = req.query.tags;
        var id = req.query.id;
        query.ne('_id', id).where('tags').in(tags);
    }

    //search by category
    if (req.query.category) {
        var ca = new RegExp(req.query.category, 'i');
        query.or([{
            'tags': {
                $in: [ca]
            }
        }]);
    }

    //search by search
    if (req.query.search) {
        var search = req.query.search;
        var re = new RegExp(search, 'i');
        query.or([{
            'name': {
                $regex: re
            }
        }, {
            'ingredients': {
                $in: [re]
            }
        }, {
            'tags': {
                $in: [re]
            }
        }]);
    }

    //search by author
    if (req.query.createdBy) {
        query.where('createdBy').equals(req.query.createdBy);
    }

    //limit the result
    if (req.query.limit) {
        var n = req.query.limit;
        query.limit(n);
    }

    query.populate('createdBy').sort('-createdDate').exec(function(err, dishes) {
        if (err) {
            return next(err);
        }
        res.status(200).json(dishes);
    });
});

// on routes that end in /api/dishes/:dishId
// ----------------------------------------------------
router.get('/dishes/:dishId', function(req, res, next) {
    'use strict';
    Dish.findById(req.params.dishId).exec(function(err, dish) {
        if (err) {
            return next(err);
        }
        if (!dish) {
            return next({
                message: 'dish not found.',
                status: 404
            });
        }

        res.status(200).json(dish);
    });
});

// on routes that end in /api/dishes/:dishId/instructions
// ----------------------------------------------------
router.get('/dishes/:dishId/instructions', function(req, res, next) {
    'use strict';
    Dish.findById(req.params.dishId).populate('instructions createdBy').exec(function(err, dish) {
        if (err) {
            return next(err);
        }
        if (!dish) {
            return next({
                message: 'dish not found.',
                status: 404
            });
        }

        res.status(200).json(dish);
    });
});


module.exports = router;
