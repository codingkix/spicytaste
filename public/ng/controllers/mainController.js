angular.module('spicyTaste')
    .controller('MainController', function($scope, UserService) {
        var vm = this;

        $scope.$on('login', function(_, user) {
            console.log('MainController login event called.');
            vm.currentUser = user;
        })

        $scope.logout = function() {
            vm.currentUser = null;
            UserService.logout();
        };

    });
