angular.module('spicyTaste')
    .controller('ProfileController', function(UtilityService, $location, $scope, $rootScope, $timeout, UserService, DishService) {
        'use strict';

        var vm = this;

        vm.logout = function() {
            UserService.logout().then(function() {
                $location.path('/');
            });
        };

        vm.getRecipts = function() {
            if (vm.reciptsCount === 0) {
                return;
            }

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

        $scope.$on('uploaded', function(event, newPhoto) {
            UserService.updateInfo(vm.user._id, 'photoUrl', newPhoto).success(function() {
                $rootScope.currentUser.photoUrl = newPhoto;
            }).error(function() {
                UtilityService.showStatusToast(false, 'Error, try upload the photo again.');
            });
        });

        function init() {
            $scope.setMenuBar({
                primaryTheme: true
            });

            UserService.getProfile().success(function(data) {
                vm.user = data.user;
                for (var i = 0; i < vm.user.favouriteDishes.length; i++) {
                    vm.user.favouriteDishes[i].difficultyText = DishService.getDifficultyText(vm.user.favouriteDishes[i].difficulty);
                }
                vm.reciptsCount = data.reciptsCount;
            });
        }

        init();
    });
