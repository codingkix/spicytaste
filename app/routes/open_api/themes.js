var express = require('express');
var router = express.Router();
var Theme = require('../../models/theme');

// on routes that end in /api/themes
// ----------------------------------------------------

router.get('/themes', function(req, res, next) {
    'use strict';
    var query = Theme.find().sort('-createdDate');

    //search by name
    if (req.query.name) {
        query.where('name').regex(new RegExp('^' + req.query.name + '$', 'i'));
    }

    //limit search results
    if (req.query.limit) {
        query.limit(req.query.limit);
    }

    query.populate('components.dish').exec(function(err, themes) {
        if (err) {
            return next(err);
        }
        res.status(200).json(themes);
    });
});

module.exports = router;
