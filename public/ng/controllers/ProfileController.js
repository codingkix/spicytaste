angular.module('spicyTaste')
    .controller('ProfileController', function($location, $scope, $rootScope, $timeout, UserService, DishService) {
        'use strict';

        var vm = this;

        vm.logout = function() {
            UserService.logout();
            $rootScope.currentUser = null;
            $location.path('/');
        };

        vm.getRecipts = function() {
            $scope.showSpinner = true;
            DishService.searchByAuthor($rootScope.currentUser._id).success(function(data) {
                vm.allRecipts = data;
            });
        };

        $scope.$on('onRepeatLast', function() {
            $timeout(function() {
                $scope.showSpinner = false;
            }, 400);
        });

        function init() {
            $scope.setMenuBar({
                primaryTheme: true
            });

            UserService.getProfile().success(function(data) {
                vm.user = data.user;
                vm.reciptsCount = data.reciptsCount;
            });
        }

        init();
    });
