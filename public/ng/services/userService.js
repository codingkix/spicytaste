angular.module('spicyTaste')
    .factory('UserService', function($http, CONSTANTS) {
        var userFactory = {};
        //social login
        userFactory.socialLogin = function(email, origin) {

            return userFactory.getByEmail(email).then(function(data) {
                console.log("getByEmail: ", data);

                if (!data.success) {
                    //not found, then create
                    var newUser = {
                        email: email,
                        password: CONSTANTS.SOCIAL_PASS,
                        social: origin
                    };
                    return userFactory.create(newUser);
                } else {
                    //found one with email
                    //update the linked social if not added
                    var user = data.user;
                    if (user.linkedSocial.indexOf(origin) < 0) {
                        user.linkedSocial.push(origin);
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

        //get user by email
        userFactory.getByEmail = function(email) {
            return $http.get('/api/users/' + email).then(function(response) {
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

        return userFactory;
    });
