angular.module('spicyTaste')
    .factory('SessionService', function($window) {
        var sessionFactory = {};

        sessionFactory.getLocal = function(key) {
            if ($window.localStorage) {
                var data = $window.localStorage.getItem(key);

                return angular.fromJson(data);
            }
            return false;
        }

        sessionFactory.setLocal = function(key, data) {
            return $window.localStorage && $window.localStorage.setItem(key, angular.toJson(data));
        }

        return sessionFactory;

    });
