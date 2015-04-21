angular.module('spicyTaste')
    .controller('ProfileController', function(UserService) {
        var vm = this;
        vm.user = {};

        UserService.get().then(function(user) {
            vm.user = user;
        });
    });
