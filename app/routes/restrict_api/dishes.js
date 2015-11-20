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
            return next(err);
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

    dish.save(function(err, dish) {
        if (err) {
            return next(err);
        } else {
            // return the saved dish
            res.status(201).json({
                dish: dish
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
        var dish = req.dish;
        if (typeof req.body.createdBy === 'object') {
            req.body.createdBy = req.body.createdBy._id;
        }
        req.body.photos = dish.photos;
        utility.extend(dish, req.body);
        dish.save(function(err) {
            if (err) {
                return next(err);
            }

            return res.json({
                success: true
            });
        });

    })
    //delete the dish with the id
    .delete(function(req, res, next) {
        'use strict';

        Dish.remove({
            _id: req.params.dishId
        }, function(err) {
            if (err) {
                return next(err);
            }
            return res.json({
                success: true
            });
        });
    });


// on routes that end in /api/dishes/:dishId/photos
// ----------------------------------------------------
router.put('/dishes/:dishId/photos', function(req, res, next) {
    'use strict';

    var photos = [];
    for (var i = 0; i < req.body.length; i++) {
        if (req.body[i].trim() !== '') {
            photos.push(req.body[i].trim());
        }
    }

    req.dish.photos = photos;
    req.dish.save(function(err) {
        if (err) {
            return next(err);
        }
        return res.json({
            success: true
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
                return next(err);
            }
            comment.replyTo = user;
        });
    }

    var auth = jwt.decode(req.headers['x-auth'], config.secret);

    User.findById(auth.userId).exec(function(err, user) {
        if (err) {
            return next(err);
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
                    return next(err);
                }
                return res.status(200).json(comment);
            });
        });
    });
});

// on routes that end in /api/dishes/:dishId/instructions
// ----------------------------------------------------
router.post('/dishes/:dishId/instructions', function(req, res, next) {
    'use strict';

    var instruction = new Instruction(req.body);
    instruction.save(function(err, instruction) {
        if (err) {
            return next(err);
        }
        req.dish.instructions.push(instruction);
        req.dish.save(function(err) {
            if (err) {
                return next(err);
            }

            res.json(instruction);
        });
    });
});

// on routes that end in '/api/instructions/:instructionId'
// ----------------------------------------------------
router.put('/instructions/:instructionId', function(req, res, next) {
    'use strict';
    Instruction.findById(req.params.instructionId).exec(function(err, instruction) {
        if (err) {
            return next(err);
        }

        utility.extend(instruction, req.body);

        instruction.save(function(err) {
            if (err) {
                return next(err);
            }

            res.json({
                success: true
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
        function(err) {
            if (err) {
                return next(err);
            }

            Instruction.remove({
                _id: instructionId
            }, function(err) {
                if (err) {
                    return next(err);
                }
                return res.json({
                    success: true
                });
            });
        }
    );
});

module.exports = router;
