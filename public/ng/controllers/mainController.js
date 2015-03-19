angular.module('spicyTaste')
    .controller('MainController', function($scope, UserService, CONSTANTS) {
        var vm = this;

        $scope.$on('login', function(_, user) {
            vm.currentUser = user;
        })

        vm.logout = function() {
            if (vm.currentUser.loginType == CONSTANTS.FACEBOOK) {
                FB.logout(function(response) {

                });
            }
            vm.currentUser = null;
            UserService.logout();
        };

    });
