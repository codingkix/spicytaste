angular.module('spicyTaste')
    .controller('LoginController', function($scope, UserService, $location, CONSTANTS, md5) {
        var vm = this;
        vm.email = "";
        vm.password = "";
        vm.userName = "";
        vm.showSignUpForm = false;

        vm.fbLogin = function() {
            FB.login(function(response) {
                if (response.status === 'connected') {
                    // Logged into your app and Facebook.
                    FB.api('/me', function(response) {
                        console.log('fb user: ', response);
                        var fbUser = {
                            userName: response.name,
                            email: response.email,
                            password: CONSTANTS.SOCIAL_PASS,
                            photoUrl: 'http://graph.facebook.com/' + response.id + '/picture?type=large',
                            linkedSocial: CONSTANTS.FACEBOOK
                        }
                        UserService.socialLogin(fbUser).then(function(user) {
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
                userName: vm.userName,
                email: vm.email,
                password: vm.password,
                photoUrl: 'http://www.gravatar.com/avatar/' + md5.createHash(vm.email),
                linkedSocial: CONSTANTS.EMAIL
            };

            UserService.create(newUser).then(function(user) {
                $scope.$emit('login', user);
                $location.path('/');
            });
        }
    });
