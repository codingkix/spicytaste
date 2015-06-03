angular.module('spicyTaste')
    .controller('ProfileController', function($location, $rootScope, UserService) {
        var vm = this;
        init();

        vm.logout = function() {
            UserService.logout();
            $rootScope.currentUser = null;
            $location.path('/');
        };

        function init() {
            vm.user = {};
            UserService.get().then(function(user) {
                vm.user = user;
            });
        }

    });
