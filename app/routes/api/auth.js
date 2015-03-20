var express = require('express');
var router = express.Router();
var User = require('../../models/user');
var jwt = require('jwt-simple');
var config = require('../../../config');
var bcrypt = require('bcrypt');

router.post('/auth', function(req, res) {
    console.log('/auth: ', req.body);

    User.findOne({
        email: req.body.email
    }, function(err, user) {
        if (err) {
            return res.send(err);
        }

        if (!user) {
            return res.sendStatus(401);
        }
        //only compare encrypted password when user login with email/password
        if (user.password != config.defaultPassword) {
            bcrypt.compare(req.body.password, user.password, function(err, valid) {
                if (err)
                    return res.send(err);
                if (!valid) {
                    return res.sendStatus(401);
                }

                var token = jwt.encode({
                    email: user.email
                }, config.secret);

                res.send(token);

            });
        } else {
            var token = jwt.encode({
                email: user.email
            }, config.secret);

            res.send(token);
        }

    });
});

module.exports = router;
