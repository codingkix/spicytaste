var express = require('express');
var bodyParser = require('body-parser');

var router = express.Router();
router.use(bodyParser.json());

router.use('/api', require('./api/dishes'));

//testing purpose for api
router.get('/api', function(req, res) {
    res.json({
        message: 'hello'
    });
});

module.exports = router;
