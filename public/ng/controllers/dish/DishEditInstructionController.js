angular.module('spicyTaste')
    .controller('DishEditInstructionController', function($scope, DishService, $routeParams, UtilityService) {
        'use strict';

        var vm = this;

        function init() {
            $scope.setMenuBar({
                primaryTheme: true
            });

            vm.newInstruction = {
                text: '',
                photo: ''
            };

            DishService.getDishWithInstructions($routeParams.dishId).success(function(data) {
                vm.dish = data;
                for (var i = 0; i < vm.dish.instructions.length; i++) {
                    vm.dish.instructions[i].showTips = angular.isString(vm.dish.instructions[i].tips) && vm.dish.instructions[i].tips !== '';
                }
            });
        }

        vm.save = function(index) {
            var item = vm.dish.instructions[index];
            item.showTips = item.tips !== '';
            if (item._id) {
                DishService.updateInstruction(item).success(function() {
                    UtilityService.showStatusToast(true, 'Instruction Info Is Updated.', 'md-tabs');
                }).error(function() {
                    UtilityService.showStatusToast(false, 'Error, please try again.', 'md-tabs');
                });
            } else {
                DishService.addInstruction($routeParams.dishId, item).success(function(data) {
                    vm.dish.instructions[index]._id = data._id;
                    UtilityService.showStatusToast(true, 'Instruction Is Saved.', 'md-tabs');
                }).error(function() {
                    UtilityService.showStatusToast(false, 'Error, please try again.', 'md-tabs');
                });
            }

        };

        vm.remove = function(index) {
            var item = vm.dish.instructions[index];
            if (item._id) {
                DishService.removeInstruction($routeParams.dishId, vm.dish.instructions[index]._id).success(function() {
                    vm.dish.instructions.splice(index, 1);
                }).error(function() {
                    UtilityService.showStatusToast(false, 'Error, please try again.', 'md-tabs');
                });
            } else {
                vm.dish.instructions.splice(index, 1);
            }

        };

        vm.add = function() {
            vm.dish.instructions.push({});
        };

        init();
    });
