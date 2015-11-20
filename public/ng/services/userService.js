angular.module('spicyTaste')
    .factory('UserService', function($http, $rootScope, $window, CONSTANTS) {
        'use strict';

        var userFactory = {};
        var baseUrl = '/api/users/';

        //fb login
        userFactory.fbLogin = function(fbUser) {
            return $http.post('/api/auth/facebook', fbUser);
        };

        //login user
        userFactory.login = function(email, password) {

            return $http.post('/api/auth', {
                email: email,
                password: password
            });
        };

        //logout user
        userFactory.logout = function() {
            delete $http.defaults.headers.common['X-Auth'];
            $window.localStorage.removeItem(CONSTANTS.LOCAL_STORAGE_KEY);
        };

        //search user by field
        userFactory.searchBy = function(query) {
            return $http.get('/api/users?' + query).then(function(response) {
                return response.data;
            });
        };

        userFactory.getCurrentUser = function() {
            return $http.get('/api/me');
        };

        //get user by id
        userFactory.getById = function(userId) {
            return $http.get(baseUrl + userId).then(function(response) {
                return response.data;
            });
        };

        //get user full profile
        userFactory.getProfile = function() {
            return $http.get('/api/me/profile');
        };
        //create a new user
        userFactory.create = function(user) {
            return $http.post(baseUrl, user).then(function() {
                return userFactory.login(user.email, user.password);
            });
        };

        //update user
        userFactory.update = function(user) {
            return $http.put(baseUrl + user.userId, user).then(function(response) {
                return response.data;
            });
        };

        //collect dish as favourite
        userFactory.collect = function(dishId) {
            return $http.put(baseUrl + $rootScope.currentUser._id + '/dishes/' + dishId);
        };

        //authorize user
        userFactory.authorize = function(requirePermissions) {
            console.log('requirePermissions', requirePermissions);
            return userFactory.getCurrentUser().success(function(user) {
                if (user && user.role === 'ADMIN') {
                    return true;
                }
                if (user && requirePermissions.indexOf(user.role) >= 0) {
                    return true;
                }
                return false;
            }).error(function(err) {
                console.log('error', err);
                return false;
            });
        };

        return userFactory;
    });
