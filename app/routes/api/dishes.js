var express = require('express');
var router = express.Router();
var Dish = require('../../models/dish');

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
        dish.images = req.body.images; // set the dish images (comes from the request)

        console.log("dish added: " + JSON.stringify(req.body));

        dish.save(function(err, dish) {
            if (err) {
                res.send(err);
            } else {
                // return the saved dish
                res.status(201).json(dish);
            }
        });
    });

// on routes that end in /api/dishes/:dish_id
// ----------------------------------------------------
router.route('/dishes/:dish_id')
    //get the dish with the id
    .get(function(req, res) {
        Dish.findById(req.params.dish_id, function(err, dish) {
            if (err) res.send(err);

            res.status(200).json(dish);
        });
    })
    //update the dish with the id
    .put(function(req, res) {
        Dish.findById(req.params.dish_id, function(err, dish) {
            if (err) res.send(err);

            dish.name = req.body.name;
            dish.tags = req.body.tags;
            dish.images = req.body.images;

            dish.save(function(err) {
                if (err) res.send(err);

                res.json({
                    message: 'Dish updated!'
                });
            });
        });
    })
module.exports = router;
