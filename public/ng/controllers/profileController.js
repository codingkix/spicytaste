angular.module('spicyTaste')
    .controller('ProfileController', function($location, $rootScope, UserService) {
        'use strict';

        var vm = this;
        init();

        vm.logout = function() {
            UserService.logout();
            $rootScope.currentUser = null;
            $location.path('/');
        };

        function init() {
            vm.user = {};
            UserService.getById($rootScope.currentUser._id).then(function(user) {
                vm.user = user;
            });
        }

    });
