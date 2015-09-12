var express = require('express');
var router = express.Router();
var Dish = require('../../models/dish');
var User = require('../../models/user');
var Comment = require('../../models/comment');
var Instruction = require('../../models/instruction');
var jwt = require('jwt-simple');
var config = require('../../../config');

//preload dish object on routes with ":dish_id"
router.param('dish_id', function(req, res, next, dish_id) {
    var query = Dish.findById(dish_id);

    query.populate('comments instructions').exec(function(err, dish) {
        if (err) return next(err);
        if (!dish) {
            return next({
                message: "dish not found.",
                status: 404
            });
        }

        req.dish = dish;

        if (dish.comments.length > 0) {
            Comment.populate(dish.comments, {
                path: 'author replyTo'
            }, function(err, data) {
                req.dish = dish;
                return next();
            });
        } else {
            return next();
        }

    });
});


// on routes that end in /api/dishes
// ----------------------------------------------------
router.route('/dishes')
    //get all dishes and order by createDate desc(GET http://localhost:5050/api/dishes)
    .get(function(req, res, next) {
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
        })
    })
    //create a new dish (POST http://localhost:5050/api/dishes)
    .post(function(req, res, next) {
        var dish = new Dish(); // create a new instance of the dish model
        dish.name = req.body.name;
        dish.tags = req.body.tags; // set the dish tags (comes from the request)
        dish.imageUrl = req.body.imageUrl; // set the dish imageUrl (comes from the request)
        dish.blog = req.body.blog;
        dish.ingredients = req.body.ingredients;
        dish.photos = req.body.photos;
        dish.prepTime = req.body.prepTime;
        dish.totalTime = req.body.totalTime;
        dish.difficulty = req.body.difficulty;

        dish.save(function(err, dish) {
            if (err) {
                return next(err);
            } else {
                // return the saved dish
                res.status(201).json({
                    dish: dish,
                    success: true,
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
    .put(function(req, res, next) {
        var dish = req.dish;
        dish.name = req.body.name ? req.body.name : dish.name; // set the dish name (comes from the request)
        dish.tags = req.body.tags ? req.body.tags : dish.tags; // set the dish tags (comes from the request)
        dish.imageUrl = req.body.imageUrl ? req.body.imageUrl : dish.imageUrl; // set the dish imageUrl (comes from the request)
        dish.blog = req.body.blog ? req.body.blog : dish.blog;
        dish.ingredients = req.body.ingredients ? req.body.ingredients : dish.ingredients;
        dish.photos = req.body.photos ? req.body.photos : dish.photos;
        dish.prepTime = req.body.prepTime ? req.body.prepTime : dish.prepTime;
        dish.totalTime = req.body.totalTime ? req.body.totalTime : dish.totalTime;
        dish.difficulty = req.body.difficulty ? req.body.difficulty : dish.difficulty;

        dish.save(function(err) {
            if (err) return next(err);

            res.json({
                success: true,
                message: 'Dish updated!'
            });
        });
    })
    //delete the dish with the id
    .delete(function(req, res, next) {
        Dish.remove({
            _id: req.params.dish_id
        }, function(err, dish) {
            if (err) next(err);
            res.json({
                success: true,
                message: "Dish deleted"
            });
        })
    });

// on routes that end in /api/dishes/:dish_id/comments
// ----------------------------------------------------
router.post('/dishes/:dish_id/comments', function(req, res, next) {
    var comment = new Comment({
        content: req.body.content
    });

    if (!req.headers['x-auth']) {
        return next({
            message: "not authorized.",
            status: 401
        });
    }


    if (req.body.replyTo) {
        User.findById(req.body.replyTo).exec(function(err, user) {
            if (err) return next(err);
            comment.replyTo = user;
        });
    }

    var auth = jwt.decode(req.headers['x-auth'], config.secret);

    User.findOne({
        email: auth.email
    }, function(err, user) {
        if (err) next(err);
        comment.author = user;
        comment.dish = req.dish;

        comment.save(function(err, comment) {
            if (err) return next(err);
            req.dish.comments.push(comment);
            req.dish.save(function(err, dish) {
                if (err) return next(err);
                Comment.populate(comment, {
                    path: 'author replyTo'
                }, function(err, comment) {
                    if (err) next(err);
                    res.json(comment);
                })
            });
        });
    });
});

// on routes that end in /api/dishes/:dish_id/instructions
// ----------------------------------------------------
router.post('/dishes/:dish_id/instructions', function(req, res, next) {
    var instruction = new Instruction({
        text: req.body.text,
        photo: req.body.photo
    });

    instruction.save(function(err, instruction) {
        if (err) return next(err);
        req.dish.instructions.push(instruction);
        req.dish.save(function(err, dish) {
            if (err) return next(err);

            res.json({
                success: true,
                message: 'Dish Instruction Added!'
            });
        });
    })
});

// on routes that end in /api/dishes/:dish_id/instructions
// ----------------------------------------------------
router.delete('/dishes/:dish_id/instructions/:instruction_id', function(req, res, next) {
    var dishId = req.params.dish_id;
    var instructionId = req.params.instruction_id;

    Dish.findByIdAndUpdate(
        dishId, {
            $pull: {
                'instructions': {
                    _id: instructionId
                }
            }
        },
        function(err, dish) {
            if (err) return next(err);

            Instruction.remove({
                _id: instructionId
            }, function(err, data) {
                if (err) return next(err);
                return res.json({
                    success: true,
                    message: 'Dish instruction deleted'
                });
            })
        }
    );
});

module.exports = router;
