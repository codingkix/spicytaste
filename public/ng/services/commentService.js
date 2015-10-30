angular.module('spicyTaste')
    .factory('CommentService', function($http) {
        'use strict';
        var commentFactory = {};
        var baseUrl = '/api/comments';

        commentFactory.getByDish = function(dishId, limit) {
            var routeUrl = baseUrl + '?dishId=' + dishId;
            if (limit) {
                routeUrl += '&limit=' + limit;
            }
            return $http.get(routeUrl);
        };

        commentFactory.countByDish = function(dishId) {
            return $http.get(baseUrl + '/count/?dish=' + dishId);
        };

        return commentFactory;
    });
