angular.module('spicyTaste')
    .controller('DishShareController', function($scope, DishService, $location, $rootScope) {
        'use strict';
        var vm = this;
        $scope.$on('logined', function() {
            vm.isLogined = true;
        });

        function init() {
            $scope.setMenuBar({});
            vm.newReciptName = '';
            vm.showLogin = true;
            vm.isLogined = !angular.isUndefined($rootScope.currentUser) && $rootScope.currentUser !== null;
        }

        vm.create = function() {
            DishService.create({
                name: vm.newReciptName,
                createdBy: $rootScope.currentUser._id
            }).success(function(data) {
                $location.path('/me/dishes/' + data.dish._id);
            });
        };
        init();
    });
