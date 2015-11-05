var express = require('express');
var router = express.Router();
var Dish = require('../../models/dish');
var Comment = require('../../models/comment');
var User = require('../../models/user');
var Instruction = require('../../models/instruction');
var jwt = require('jsonwebtoken');
var config = require('../../../config');
var utility = require('../../utils');

//preload dish object on routes with ":dishId"
router.param('dishId', function(req, res, next, dishId) {
    'use strict';
    Dish.findById(dishId).exec(function(err, dish) {
        if (err) {
            next(err);
        }
        if (!dish) {
            return next({
                message: 'dish not found.',
                status: 404
            });
        }


        req.dish = dish;

        return next();
    });
});

// on routes that end in /api/dishes
// ----------------------------------------------------
router.post('/dishes', function(req, res, next) {
    'use strict';

    var dish = new Dish(); // create a new instance of the dish model
    utility.extend(dish, req.body);
    console.log('dish', dish);

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


// on routes that end in /api/dishes/:dishId
// ----------------------------------------------------
router.route('/dishes/:dishId')
    //update the dish with the id
    .put(function(req, res, next) {
        'use strict';

        Dish.findById(req.params.dishId).exec(function(err, dish) {
            if (err) {
                return next(err);
            }

            if (dish) {
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
                    if (err) {
                        return next(err);
                    }

                    res.json({
                        success: true,
                        message: 'Dish updated!'
                    });
                });
            }
        });

    })
    //delete the dish with the id
    .delete(function(req, res, next) {
        'use strict';

        Dish.remove({
            _id: req.params.dishId
        }, function(err, dish) {
            if (err) {
                next(err);
            }
            res.json({
                success: true,
                message: 'Dish deleted'
            });
        });
    });

// on routes that end in /api/dishes/:dishId/comments
// ----------------------------------------------------
router.post('/dishes/:dishId/comments', function(req, res, next) {
    'use strict';
    var comment = new Comment({
        content: req.body.content
    });

    if (req.body.replyTo) {
        User.findById(req.body.replyTo).exec(function(err, user) {
            if (err) {
                next(err);
            }
            comment.replyTo = user;
        });
    }

    var auth = jwt.decode(req.headers['x-auth'], config.secret);

    User.findById(auth.userId).exec(function(err, user) {
        if (err) {
            next(err);
        }
        comment.author = user;
        comment.dish = req.dish;

        comment.save(function(err, comment) {
            if (err) {
                return next(err);
            }

            Comment.populate(comment, {
                path: 'author replyTo'
            }, function(err, comment) {
                if (err) {
                    next(err);
                }
                res.status(200).json(comment);
            });
        });
    });
});

// on routes that end in /api/dishes/:dishId/instructions
// ----------------------------------------------------
router.post('/dishes/:dishId/instructions', function(req, res, next) {
    'use strict';

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
    });
});

// on routes that end in /api/dishes/:dishId/instructions
// ----------------------------------------------------
router.delete('/dishes/:dishId/instructions/:instructionId', function(req, res, next) {
    'use strict';

    var dishId = req.params.dishId;
    var instructionId = req.params.instructionId;

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
            });
        }
    );
});

module.exports = router;
