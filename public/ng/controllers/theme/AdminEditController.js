angular.module('spicyTaste')
    .controller('ThemeAdminEditController', function(ThemeService, $routeParams, $timeout, DishService) {
        'use strict';

        var vm = this;

        vm.update = function() {
            ThemeService.update(vm.theme._id, vm.theme).success(function(data) {
                if (data.success) {
                    vm.updateSuccess = true;

                    $timeout(function() {
                        vm.updateSuccess = false;
                    }, 800);
                }

            });
        };

        vm.addDish = function(dish) {
            vm.theme.components.push({
                title: '',
                displayOrder: vm.theme.components.length + 1,
                dish: dish
            });
        };

        vm.removeComponent = function(index) {
            vm.theme.components.splice(index, 1);
        };

        vm.getDisplayOrders = function() {
            var orders = [];
            for (var i = 0; i < vm.theme.components.length; i++) {
                orders.push(i + 1);
            }

            return orders;
        };

        function init() {
            vm.theme = {};
            vm.dishes = [];

            ThemeService.get($routeParams.id).success(function(data) {
                vm.theme = data;
            });

            DishService.all().success(function(data) {
                vm.dishes = data;
            });
        }

        init();

    });
