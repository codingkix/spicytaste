angular.module('spicyTaste')
    .controller('MainController', function($rootScope, $location, $mdDialog, $http, SessionService, UserService, CONSTANTS) {
        var vm = this;
        init();

        vm.toggleMobileMenu = function() {
            vm.showMobileMenu = !vm.showMobileMenu;
        }

        vm.showLoginDialog = function(ev) {
            $mdDialog.show({
                clickOutsideToClose: true,
                templateUrl: 'ng/views/dialogs/login.html',
                targetEvent: ev,
                controller: 'MainController',
                controllerAs: 'main'
            }).then(function(user) {
                $rootScope.currentUser = user;
            });
        };

        vm.fbLogin = function() {
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
                        }
                        UserService.socialLogin(fbUser).then(function(user) {
                            user.loginType = CONSTANTS.FACEBOOK;
                            afterAuth(user);
                        })

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
        }

        vm.login = function() {
            UserService.login(vm.email, vm.password).then(function(user) {
                user.loginType = CONSTANTS.EMAIL;
                afterAuth(user);
            });
        }

        vm.signUp = function() {
            var newUser = {
                userName: vm.userName,
                email: vm.email,
                password: vm.password,
                photoUrl: 'http://www.gravatar.com/avatar/' + md5.createHash(vm.email),
                linkedSocial: CONSTANTS.EMAIL
            };

            UserService.create(newUser).then(function(user) {
                user.loginType = CONSTANTS.EMAIL;
                afterAuth(user);
            });

        }

        function afterAuth(user) {
            var token = $http.defaults.headers.common['X-Auth'];
            SessionService.setLocal(CONSTANTS.LOCAL_STORAGE_KEY, token);
            $mdDialog.hide(user);
        }

        function init() {
            vm.showMobileMenu = false;
            vm.email = "";
            vm.password = "";
            vm.userName = "";

            var loginedToken = SessionService.getLocal(CONSTANTS.LOCAL_STORAGE_KEY);
            if (loginedToken) {
                $http.defaults.headers.common['X-Auth'] = loginedToken;
                UserService.get().then(function(user) {
                    $rootScope.currentUser = user;
                });
            }
        }

    });
