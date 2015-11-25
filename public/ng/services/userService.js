angular.module('spicyTaste')
    .factory('UserService', function($http, $rootScope, $q, $window, CONSTANTS, SessionService) {
        'use strict';

        var userFactory = {};
        var baseUrl = '/api/users/';

        function afterAuth(result) {
            $http.defaults.headers.common['X-Auth'] = result.token;
            SessionService.setLocal(CONSTANTS.LOCAL_STORAGE_KEY, result.token);
            $rootScope.currentUser = result.user;
            return true;
        }

        function authFB(fbUser) {

            return $http.post('/api/auth/facebook', fbUser).then(function(response) {
                return afterAuth(response.data);
            }, function() {});
        }

        //fb login
        userFactory.fbLogin = function() {
            FB.login(function(response) {
                if (response.status === 'connected') {

                } else if (response.status === 'not_authorized') {
                    // The person is logged into Facebook, but not your app.
                } else {
                    // The person is not logged into Facebook, so we're not sure if
                    // they are logged into this app or not.
                }
            }, {
                scope: 'public_profile,email'
            });
        };

        userFactory.watchFBAuthChange = function() {
            FB.Event.subscribe('auth.authResponseChange', function(res) {
                if (res.status === 'connected') {
                    userFactory.getFBUserInfo().then(function(fbUser) {
                        if (!$rootScope.currentUser) {
                            authFB(fbUser);
                        } else {
                            userFactory.updateInfo($rootScope.currentUser._id, 'facebook', fbUser.facebook);
                        }
                    });
                } else {}

            });
        };

        userFactory.getFBUserInfo = function() {
            var deffered = $q.defer();

            FB.api('/me', {
                fields: 'id, name, email'
            }, function(response) {
                if (!response || response.error) {
                    deffered.reject('FB api/me error');
                }

                var fbUser = {
                    userName: response.name,
                    email: response.email,
                    photoUrl: 'http://graph.facebook.com/' + response.id + '/picture?type=large',
                    facebook: {
                        id: response.id,
                        email: response.email
                    }
                };
                deffered.resolve(fbUser);

            });

            return deffered.promise;
        };

        //login user
        userFactory.login = function(email, password) {

            return $http.post('/api/auth', {
                email: email,
                password: password
            }).then(function(response) {
                return afterAuth(response.data);
            }, function() {
                return false;
            });
        };

        //logout user
        userFactory.logout = function() {
            var deffered = $q.defer();
            delete $http.defaults.headers.common['X-Auth'];
            $window.localStorage.removeItem(CONSTANTS.LOCAL_STORAGE_KEY);

            FB.getLoginStatus(function(response) {
                if (response.status === 'connected') {
                    FB.logout(function() {
                        deffered.resolve();
                    });
                } else {
                    deffered.resolve();
                }
            });

            $rootScope.currentUser = null;
            return deffered.promise;
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
            return $http.put(baseUrl + user.userId, user);
        };

        userFactory.updateInfo = function(userId, field, newValue) {
            return $http.put(baseUrl + userId + '/field', {
                field: field,
                newValue: newValue
            });
        };

        //collect dish as favourite
        userFactory.collect = function(dishId) {
            return $http.put(baseUrl + $rootScope.currentUser._id + '/dishes/' + dishId);
        };

        //authorize user
        userFactory.authorize = function(requirePermissions) {
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
