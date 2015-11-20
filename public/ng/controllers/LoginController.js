angular.module('spicyTaste')
    .controller('LoginController', function($rootScope, $scope, $mdDialog, UserService, md5, CONSTANTS, $http, SessionService) {
        'use strict';

        var vm = this;

        vm.fbLogin = function() {
            FB.login(function(response) {
                if (response.status === 'connected') {
                    // Logged into your app and Facebook.
                    FB.api('/me', function(response) {
                        var fbUser = {
                            userName: response.name,
                            email: response.email,
                            photoUrl: 'http://graph.facebook.com/' + response.id + '/picture?type=large',
                            facebook: {
                                id: response.id
                            }
                        };

                        UserService.fbLogin(fbUser).then(function(response) {
                            afterAuth(response.data);
                        }, function() {
                            vm.loginFailed = true;
                        });

                    });
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

        vm.login = function() {
            UserService.login(vm.email, vm.password).then(function(response) {
                afterAuth(response.data);
            }, function() {
                vm.loginFailed = true;
            });
        };

        vm.signUp = function() {
            var newUser = {
                userName: vm.userName,
                email: vm.email,
                password: vm.password,
                photoUrl: 'http://www.gravatar.com/avatar/' + md5.createHash(vm.email)
            };

            UserService.create(newUser).then(function(response) {
                afterAuth(response.data);
            });

        };

        function init() {
            vm.title = vm.dialogTitle;
            vm.email = '';
            vm.password = '';
            vm.userName = '';
            vm.loginFailed = false;
        }

        function afterAuth(result) {
            console.log('login result', result);

            $http.defaults.headers.common['X-Auth'] = result.token;
            SessionService.setLocal(CONSTANTS.LOCAL_STORAGE_KEY, result.token);
            $rootScope.currentUser = result.user;
            $mdDialog.hide();
        }

        init();
    });
