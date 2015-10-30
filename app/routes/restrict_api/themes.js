var express = require('express');
var router = express.Router();
var Theme = require('../../models/theme');

// on routes that end in /api/themes
// ----------------------------------------------------
router.post('/themes', function(req, res, next) {
    'use strict';

    var theme = new Theme(req.body);
    theme.save(function(err, theme) {
        if (err) {
            return next(err);
        } else {
            // return the saved theme
            res.status(201).json({
                theme: theme,
                success: true,
                message: 'theme created!'
            });
        }
    });
});


// on routes that end in /api/themes/:id
// ----------------------------------------------------
router.put('/themes/:id', function(req, res, next) {
    'use strict';

    var theme = req.body;
    var components = [];
    if (theme.components) {
        for (var i = 0; i < theme.components.length; i++) {
            components.push({
                title: theme.components[i].title,
                displayOrder: theme.components[i].displayOrder,
                description: theme.components[i].description,
                dish: theme.components[i].dish._id
            });
        }
    }

    Theme.update({
        '_id': req.params.id
    }, {
        '$set': {
            'name': theme.name,
            'slogan': theme.slogan,
            'thumbnail': theme.thumbnail,
            'image': theme.image,
            'description': theme.description,
            'components': components
        }
    }, function(err) {
        if (err) {
            next(err);
            console.log(err);
        }

        res.json({
            success: true
        });
    });
});


// on routes that end in /api/themes/:id
// ----------------------------------------------------
router.get('/themes/:id', function(req, res, next) {
    'use strict';

    var query = Theme.findById(req.params.id);
    query.populate('components.dish').exec(function(err, theme) {
        if (err) {
            return next(err);
        }
        if (!theme) {
            return next({
                message: 'theme not found.',
                status: 404
            });
        }

        theme.components.sort(function(c1, c2) {
            return c1.displayOrder - c2.displayOrder;
        });

        res.status(200).send(theme);

    });
});


module.exports = router;
