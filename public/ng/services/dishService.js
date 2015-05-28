angular.module('spicyTaste')
    .factory('DishService', function($http) {

        //create a new object
        var dishFactory = {};

        //get all dishes
        dishFactory.all = function() {
            return $http.get('/api/dishes');
        };

        //get limited latest dishes
        dishFactory.limit = function(num) {
            return $http.get('/api/dishes?limit=' + num);
        }

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

        //delete a dish
        dishFactory.delete = function(dish_id) {
            return $http.delete('/api/dishes/' + dish_id);
        }

        //add a comment
        dishFactory.addComment = function(dish_id, comment) {
            return $http.post('/api/dishes/' + dish_id + '/comments', comment);
        }

        //get difficulty
        dishFactory.getDifficulties = function() {
            return ['初学', '容易', '一般', '较难', '专业'];
        }
        return dishFactory;
    });
