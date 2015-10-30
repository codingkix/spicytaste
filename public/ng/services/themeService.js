angular.module('spicyTaste')
    .factory('ThemeService', function($http, $filter) {
        'use strict';

        var themeFactory = {};

        themeFactory.getAll = function() {
            return $http.get('/api/themes');
        };

        themeFactory.get = function(id) {
            return $http.get('/api/themes/' + id);
        };

        themeFactory.searchBy = function(query) {
            return $http.get('/api/themes/?' + query);
        };

        themeFactory.create = function(theme) {
            return $http.post('/api/themes/', theme);
        };

        themeFactory.update = function(id, theme) {
            return $http.put('/api/themes/' + id, theme);
        };

        themeFactory.getOthers = function(name, num) {
            var query = 'limit=' + (num + 1);
            return themeFactory.searchBy(query).then(function(response) {
                var others = $filter('filter')(response.data, {
                    name: name
                }, function(actual, expected) {
                    return expected.toLowerCase().trim() !== actual.toLowerCase().trim();
                });

                if (others.length > num) {
                    return others.splice(0, 1);
                }

                return others;
            });
        };

        return themeFactory;
    });
