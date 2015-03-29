angular.module('spicyTaste')
    .controller('MainController', function($scope, $rootScope, $location, UserService, CONSTANTS) {
        var vm = this;

        $scope.$on('login', function(_, user) {
            $rootScope.user = vm.currentUser = user;
            var returnUrl = $location.search().returnUrl;
            if (returnUrl) {
                $location.path(returnUrl).search({
                    returnUrl: null
                });
            } else {
                $location.path('/');
            }
        })

        vm.logout = function() {
            if (vm.currentUser.loginType == CONSTANTS.FACEBOOK) {
                FB.logout(function(response) {

                });
            }
            vm.currentUser = null;
            $rootScope.user = null;

            UserService.logout();
        };

    });
