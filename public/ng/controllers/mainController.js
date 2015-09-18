angular.module('spicyTaste')
    .controller('MainController', function($rootScope, $scope, $location, $mdDialog, $http, SessionService, UserService, CONSTANTS) {
        'use strict';
        var vm = this;
        init();

        vm.toggleMobileMenu = function() {
            vm.showMobileMenu = !vm.showMobileMenu;
        };

        $scope.showLoginDialog = function(ev, postLogin, title) {
            var promise = $mdDialog.show({
                clickOutsideToClose: true,
                templateUrl: 'ng/views/dialogs/login.html',
                targetEvent: ev,
                controller: loginController,
                controllerAs: 'login',
                locals: {
                    dialogTitle: title
                }
            });
            if (postLogin) {
                return promise;
            } else {
                promise.then(function(user) {
                    $rootScope.currentUser = user;
                    // if (user.role && user.role == "Admin") {
                    //     $location.path('/admin/dishes');
                    // } else {
                    //     $location.path('/');
                    // }
                });
            }
        };

        function loginController(dialogTitle, $mdDialog, UserService, md5) {
            var dvm = this;
            dvm.title = dialogTitle;
            dvm.email = '';
            dvm.password = '';
            dvm.userName = '';

            dvm.fbLogin = function() {
                FB.login(function(response) {
                    if (response.status === 'connected') {
                        // Logged into your app and Facebook.
                        FB.api('/me', function(response) {
                            var fbUser = {
                                userName: response.name,
                                email: response.email,
                                password: CONSTANTS.SOCIAL_PASS,
                                photoUrl: 'http://graph.facebook.com/' + response.id + '/picture?type=large',
                                linkedSocial: CONSTANTS.FACEBOOK
                            };

                            UserService.socialLogin(fbUser).then(function(user) {
                                user.loginType = CONSTANTS.FACEBOOK;
                                afterAuth(user);
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

            dvm.login = function() {
                UserService.login(dvm.email, dvm.password).then(function(user) {
                    user.loginType = CONSTANTS.EMAIL;
                    afterAuth(user);
                });
            };

            dvm.signUp = function() {
                var newUser = {
                    userName: dvm.userName,
                    email: dvm.email,
                    password: dvm.password,
                    photoUrl: 'http://www.gravatar.com/avatar/' + md5.createHash(dvm.email),
                    linkedSocial: CONSTANTS.EMAIL
                };

                UserService.create(newUser).then(function(user) {
                    user.loginType = CONSTANTS.EMAIL;
                    afterAuth(user);
                });

            };

            function afterAuth(user) {
                var token = $http.defaults.headers.common['X-Auth'];
                SessionService.setLocal(CONSTANTS.LOCAL_STORAGE_KEY, token);
                $mdDialog.hide(user);
            }
        }

        function init() {
            vm.showMobileMenu = false;
            var loginedToken = SessionService.getLocal(CONSTANTS.LOCAL_STORAGE_KEY);
            if (loginedToken) {
                console.log('token', loginedToken);

                $http.defaults.headers.common['X-Auth'] = loginedToken;
                UserService.getCurrentUser().then(function(user) {
                    $rootScope.currentUser = user;
                });
            }
        }

    });
