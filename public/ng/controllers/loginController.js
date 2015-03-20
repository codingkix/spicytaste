angular.module('spicyTaste')
    .controller('LoginController', function($scope, UserService, $location, CONSTANTS) {
        var vm = this;
        vm.email = "";
        vm.password = "";
        vm.showSignUpForm = false;

        vm.fbLogin = function() {
            FB.login(function(response) {
                if (response.status === 'connected') {
                    // Logged into your app and Facebook.
                    FB.api('/me', function(response) {
                        UserService.socialLogin(response.email, CONSTANTS.FACEBOOK).then(function(user) {
                            user.loginType = CONSTANTS.FACEBOOK;
                            $scope.$emit('login', user);
                            $location.path('/');
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
                $scope.$emit('login', user);
                $location.path('/');
            });
        }

        vm.signUp = function() {
            var newUser = {
                email: vm.email,
                password: vm.password,
                social: CONSTANTS.EMAIL
            };

            UserService.create(newUser).then(function(user) {
                $scope.$emit('login', user);
                $location.path('/');
            });
        }
    });
