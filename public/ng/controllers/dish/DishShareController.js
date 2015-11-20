angular.module('spicyTaste')
    .controller('DishShareController', function($scope, DishService, $location, $rootScope, $timeout) {
        'use strict';
        var vm = this;
        $scope.$on('logined', function() {
            vm.isLogined = true;
        });

        function init() {
            $scope.setMenuBar({
                primaryTheme: true
            });
            vm.newRecipt = {
                name: '',
                imageUrl: ''
            };
            vm.showLogin = true;
            vm.isLogined = !angular.isUndefined($rootScope.currentUser) && $rootScope.currentUser !== null;
        }

        vm.create = function() {
            vm.newRecipt.createdBy = $rootScope.currentUser._id;
            DishService.create(vm.newRecipt).success(function(data) {
                $location.path('/me/dishes/' + data.dish._id + '?wizardMode=true');
            });
        };

        vm.toggleLogin = function(show) {
            if (show) {
                vm.showSignUp = false;
                $timeout(function() {
                    vm.showLogin = true;
                }, 250);
            } else {
                vm.showLogin = false;
                $timeout(function() {
                    vm.showSignUp = true;
                }, 250);
            }
        };

        init();
    });
