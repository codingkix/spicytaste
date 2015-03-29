var express = require('express');
var router = express.Router();
var Dish = require('../../models/dish');
var User = require('../../models/user');
var Comment = require('../../models/comment');
var jwt = require('jwt-simple');
var config = require('../../../config');

//preload dish object on routes with ":dish_id"
router.param('dish_id', function(req, res, next, dish_id) {
    var query = Dish.findById(dish_id);

    query.populate('comments').exec(function(err, dish) {
        if (err) return next(err);
        if (!dish) {
            return next(new Error("dish not found."));
        }

        Comment.populate(dish.comments, {
            path: 'author replyTo'
        }, function(err, data) {
            req.dish = dish;
            return next();
        });
    });
});


// on routes that end in /api/dishes
// ----------------------------------------------------
router.route('/dishes')
    //get all dishes and order by createDate desc(GET http://localhost:5050/api/dishes)
    .get(function(req, res, next) {
        Dish.find().sort('-createdDate').exec(function(err, dishes) {
            if (err) {
                res.send(err);
            }
            res.status(200).json(dishes);
        })
    })
    //create a new dish (POST http://localhost:5050/api/dishes)
    .post(function(req, res, next) {
        var dish = new Dish(); // create a new instance of the dish model
        dish.name = req.body.name; // set the dish name (comes from the request)
        dish.tags = req.body.tags; // set the dish tags (comes from the request)
        dish.imageUrl = req.body.imageUrl; // set the dish imageUrl (comes from the request)
        dish.ingredients = req.body.ingredients;
        dish.instructions = req.body.instructions;

        dish.save(function(err, dish) {
            if (err) {
                res.send(err);
            } else {
                // return the saved dish
                res.status(201).json({
                    message: 'Dish created!'
                });
            }
        });
    });

// on routes that end in /api/dishes/:dish_id
// ----------------------------------------------------
router.route('/dishes/:dish_id')
    //get the dish with the id
    .get(function(req, res) {
        res.json(req.dish);
    })
    //update the dish with the id
    .put(function(req, res) {
        var dish = req.dish;
        dish.name = req.body.name;
        dish.tags = req.body.tags;
        dish.imageUrl = req.body.imageUrl; // set the dish imageUrl (comes from the request)

        dish.save(function(err) {
            if (err) res.send(err);

            res.json({
                message: 'Dish updated!'
            });
        });
    })
    //delete the dish with the id
    .delete(function(req, res) {
        Dish.remove({
            _id: req.params.dish_id
        }, function(err, dish) {
            if (err) res.send(err);
            res.json({
                message: "Dish deleted"
            });
        })
    });

// on routes that end in /api/dishes/:dish_id/comments
// ----------------------------------------------------
router.post('/dishes/:dish_id/comments', function(req, res) {
    var comment = new Comment({
        content: req.body.content
    });

    if (!req.headers['x-auth']) {
        console.log(req.headers['x-auth']);
        res.sendStatus(401);
    }

    if (req.body.replyTo) {
        User.findById(req.body.replyTo).exec(function(err, user) {
            if (err) res.send(err);
            comment.replyTo = user;
        });
    }

    var auth = jwt.decode(req.headers['x-auth'], config.secret);
    User.findOne({
        email: auth.email
    }, function(err, user) {
        if (err) res.send(err);
        comment.author = user;
        comment.dish = req.dish;

        comment.save(function(err, comment) {
            if (err) return res.send(err);
            req.dish.comments.push(comment);
            req.dish.save(function(err, dish) {
                if (err) return res.send(err);
                Comment.populate(comment, {
                    path: 'author replyTo'
                }, function(err, comment) {
                    if (err) res.send(err);
                    res.json(comment);
                })
            });
        });
    });
});

module.exports = router;
