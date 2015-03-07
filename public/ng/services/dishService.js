angular.module('dishServcie', [])
    .factory('DishService', function($http) {

        //create a new object
        var dishFactory = {};

        //get all dishes
        dishFactory.all = function() {
            return $http.get('/api/dishes');
        };

        //create a dish
        dishFactory.create = function(dish) {
            return $http.post('/api/dishes', dish);
        };

        //get a single dish
        dishFactory.get = function(dish_id) {
            return $http.get('/api/dishes/' + dish_id);
        }

        //update a dish
        dishFactory.update = function(dish_id, dish) {
            return $http.put('/api/dishes/' + dish_id, dish);
        }

        return dishFactory;
    });
