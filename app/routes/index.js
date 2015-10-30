var express = require('express');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var config = require('../../config');
var router = express.Router();

router.use(bodyParser.json());
router.use('/api', require('./open_api/auth'));
router.use('/api', require('./open_api/dishes'));
router.use('/api', require('./open_api/users'));
router.use('/api', require('./open_api/comments'));
router.use('/api', require('./open_api/themes'));

//route middleware to verify a token for accessing the restrict api
router.use('/api', function(req, res, next) {
    'use strict';

    //check header or url parameters or post parameters for token
    var token = req.headers['x-auth'] || req.body.token || req.query.token;

    if (token) {
        //verify secret and checks
        jwt.verify(token, config.secret, function(err, decoded) {
            if (err) {
                return res.status(401).json('failed to authenticate token.');
            } else {
                //token is verified so move next
                req.decoded = decoded;
                next();
            }
        });
    } else {
        //if there is no token
        return res.status(403).json('No token provided.');
    }
});

router.use('/api', require('./restrict_api/themes'));
router.use('/api', require('./restrict_api/users'));
router.use('/api', require('./restrict_api/dishes'));

module.exports = router;
