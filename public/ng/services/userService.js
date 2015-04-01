angular.module('spicyTaste')
    .factory('UserService', function($http, $rootScope, CONSTANTS) {
        var userFactory = {};
        //social login
        userFactory.socialLogin = function(socialUser) {
            console.log("socialUser: ", socialUser);

            return userFactory.searchBy('email=' + socialUser.email).then(function(data) {

                if (!data.success) {
                    //not found, then create
                    return userFactory.create(socialUser);
                } else {
                    //found the user with email
                    //update the linked social if not added
                    var user = data.users[0];
                    if (user.linkedSocial.indexOf(socialUser.linkedSocial) < 0) {
                        user.linkedSocial.push(socialUser.linkedSocial);
                        user.userName = socialUser.userName;
                        user.photoUrl = socialUser.photoUrl;

                        return userFactory.update(user).then(function() {
                            return userFactory.login(user.email, CONSTANTS.SOCIAL_PASS);
                        });
                    } else {
                        return userFactory.login(user.email, CONSTANTS.SOCIAL_PASS);
                    }
                }
            });
        }

        //login user
        userFactory.login = function(email, password) {

            return $http.post('/api/auth', {
                email: email,
                password: password
            }).then(function(response) {
                $http.defaults.headers.common['X-Auth'] = response.data;

                return userFactory.get();
            })
        }

        //logout user
        userFactory.logout = function() {
            delete $http.defaults.headers.common['X-Auth'];
        }

        //get current user
        userFactory.get = function() {
            return $http.get('/api/users/me').then(function(response) {
                return response.data;
            });
        }

        //search user by field
        userFactory.searchBy = function(query) {
            return $http.get('/api/users?' + query).then(function(response) {
                return response.data;
            });
        }

        //get user by id
        userFactory.getById = function(user_id) {
            return $http.get('/api/users/' + user_id).then(function(response) {
                return response.data;
            });
        }

        //create a new user
        userFactory.create = function(user) {
            return $http.post('/api/users/', user).then(function() {
                return userFactory.login(user.email, user.password);
            });
        }

        //update user
        userFactory.update = function(user_id, user) {
            return $http.put('/api/users/' + user_id, user).then(function(response) {
                return response.data;
            });
        }

        //collect dish as favourite
        userFactory.collect = function(dish_id) {
            return $http.put('/api/users/' + $rootScope.user._id + '/dishes/' + dish_id).then(function(response) {
                return response.data;
            });
        }

        return userFactory;
    });
