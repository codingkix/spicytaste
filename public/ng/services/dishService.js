angular.module('spicyTaste')
    .factory('DishService', function($http) {
        'use strict';
        //create a new object
        var dishFactory = {};
        var baseUrl = '/api/dishes/';

        //get all dishes
        dishFactory.all = function() {
            return $http.get(baseUrl);
        };

        //search dishes
        dishFactory.search = function(search) {
            return $http.get(baseUrl + '?search=' + search);
        };

        //search by category
        dishFactory.searchByCategory = function(category) {
            return $http.get(baseUrl + '?category=' + category);
        };

        //search by author
        dishFactory.searchByAuthor = function(userId) {
            return $http.get(baseUrl + '?createdBy=' + userId);
        };

        //get limited latest dishes
        dishFactory.limit = function(num) {
            return $http.get(baseUrl + '?limit=' + num);
        };

        //get related dishes by tags
        dishFactory.relate = function(id, tags, num) {
            return $http({
                method: 'GET',
                url: '/api/dishes',
                params: {
                    id: id,
                    limit: num,
                    'tags[]': tags
                }
            });
        };

        //create a dish
        dishFactory.create = function(dish) {
            return $http.post(baseUrl, dish);
        };

        //get a single dish with comments
        dishFactory.get = function(dishId) {
            return $http.get(baseUrl + dishId);
        };

        //update a dish
        dishFactory.update = function(dishId, dish) {
            return $http.put(baseUrl + dishId, dish);
        };

        //delete a dish
        dishFactory.delete = function(dishId) {
            return $http.delete(baseUrl + dishId);
        };

        //add a comment
        dishFactory.addComment = function(dishId, comment) {
            return $http.post(baseUrl + dishId + '/comments', comment);
        };

        //get all instructions
        dishFactory.getDishWithInstructions = function(dishId) {
            return $http.get(baseUrl + dishId + '/instructions');
        };

        //add a instruction
        dishFactory.addInstruction = function(dishId, instruction) {
            return $http.post(baseUrl + dishId + '/instructions', instruction);
        };

        //remove an instruction
        dishFactory.removeInstruction = function(dishId, instructionId) {
            return $http.delete(baseUrl + dishId + '/instructions/' + instructionId);
        };

        //get difficulty
        dishFactory.getDifficulties = function() {
            return ['初学', '容易', '一般', '较难', '专业'];
        };

        return dishFactory;
    });
