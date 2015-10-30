var express = require('express');
var router = express.Router();
var Comment = require('../../models/comment');

// on routes that end in /api/comments
// ----------------------------------------------------
router.get('/comments', function(req, res, next) {
    'use strict';

    var query = Comment.find({
        dish: req.query.dishId
    }).populate('author replyTo');

    if (req.query.limit) {
        query.limit(req.query.limit);
    }

    query.sort('-createdDate').exec(function(err, comments) {
        if (err) {
            return next(err);
        }

        res.status(200).send(comments);
    });
});

// on routes that end in /api/comments/count
router.get('/comments/count', function(req, res, next) {
    'use strict';
    Comment.count(req.query, function(err, count) {
        if (err) {
            return next(err);
        }

        res.status(200).json(count);
    });
});

module.exports = router;
