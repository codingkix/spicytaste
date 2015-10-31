angular.module('spicyTaste')
    .controller('DishInstructionController', function(DishService, $routeParams) {
        'use strict';
        var vm = this;

        function init() {
            DishService.getInstructions($routeParams.dishId).success(function(data) {
                vm.dish = data;

                if (vm.dish.instructions.length > 0) {
                    vm.currentIndex = 0;
                }
            });
        }

        vm.isWithinShowRange = function(index) {
            return index >= vm.currentIndex - 1 && index <= vm.currentIndex + 1;
        };

        vm.setNavClass = function(index) {
            if (index === vm.currentIndex - 1) {
                return 'pre';
            }

            if (index === vm.currentIndex) {
                return 'current';
            }

            if (index === vm.currentIndex + 1) {
                return 'next';
            }
        };

        vm.showNext = function() {
            vm.currentIndex += 1;
        };

        vm.showPre = function() {
            vm.currentIndex -= 1;
        };

        init();
    });
