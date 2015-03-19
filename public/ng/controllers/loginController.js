angular.module('spicyTaste')
    .controller('LoginController', function($scope, UserService, $location, CONSTANTS) {
        var vm = this;

        vm.fbLogin = function() {
            FB.login(function(response) {
                if (response.status === 'connected') {
                    // Logged into your app and Facebook.
                    FB.api('/me', function(response) {
                        console.log('FB.api /me response: ', response);

                        UserService.socialLogin(response.email, CONSTANTS.FACEBOOK).then(function(user) {
                            console.log('fbLogin: ', user);

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
    });
