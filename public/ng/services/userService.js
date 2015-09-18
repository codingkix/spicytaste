angular.module('spicyTaste')
    .factory('UserService', function($http, $rootScope, $window, CONSTANTS) {
        'use strict';

        var userFactory = {};

        //social login
        userFactory.socialLogin = function(socialUser) {
            return userFactory.searchBy('email=' + socialUser.email).then(function(data) {

                if (!data.success) {
                    //not found, then create
                    return userFactory.create(socialUser);
                } else {
                    //found the user with email
                    return userFactory.login(socialUser.email, CONSTANTS.SOCIAL_PASS);
                }
            });
        };

        //login user
        userFactory.login = function(email, password) {

            return $http.post('/api/auth', {
                email: email,
                password: password
            }).then(function(response) {
                $http.defaults.headers.common['X-Auth'] = response.data.token;
                return userFactory.getById(response.data.userId);
            });
        };

        //logout user
        userFactory.logout = function() {
            delete $http.defaults.headers.common['X-Auth'];
            $window.localStorage.removeItem(CONSTANTS.LOCAL_STORAGE_KEY);
            userFactory.loginedUser = null;
        };

        //search user by field
        userFactory.searchBy = function(query) {
            return $http.get('/api/users?' + query).then(function(response) {
                return response.data;
            });
        };

        userFactory.getCurrentUser = function() {
            return $http.get('/api/me').then(function(response) {
                return userFactory.getById(response.data);
            });
        };

        //get user by id
        userFactory.getById = function(user_id) {
            return $http.get('/api/users/' + user_id).then(function(response) {
                return response.data;
            });
        };

        //create a new user
        userFactory.create = function(user) {
            return $http.post('/api/users/', user).then(function() {
                return userFactory.login(user.email, user.password);
            });
        };

        //update user
        userFactory.update = function(user) {
            return $http.put('/api/users/' + user.user_id, user).then(function(response) {
                return response.data;
            });
        };

        //collect dish as favourite
        userFactory.collect = function(dish_id) {
            return $http.put('/api/users/' + $rootScope.currentUser._id + '/dishes/' + dish_id).then(function(response) {
                return response.data;
            });
        };

        //authorize user
        userFactory.authorize = function(requirePermissions) {
            return userFactory.getCurrentUser().then(function(user) {
                if (user && requirePermissions.indexOf(user.role) >= 0) {
                    return true;
                } else {
                    return false;
                }
            }, function(response) {
                return false;
            });
        };

        return userFactory;
    });
