angular.module('spicyTaste')
    .controller('DishEditController', function($scope, $mdDialog, $routeParams, DishService, $location, $timeout) {
        'use strict';
        var vm = this;

        vm.saveDish = function() {
            DishService.update($routeParams.dishId, vm.dish).success(function(data) {
                if (data.success) {
                    vm.updateSuccess = true;
                }
                $timeout(function() {
                    vm.updateSuccess = false;
                }, 1000);
            });
        };
        vm.removeInstruction = function(index) {
            console.log('instructions', vm.dish.instructions[index]);
            DishService.removeInstruction($routeParams.dishId, vm.dish.instructions[index]._id).success(function(data) {
                vm.dish.instructions.splice(index, 1);
            });
        };

        vm.removePhoto = function(index) {
            vm.dish.photos.splice(index, 1);
            vm.saveDish();
        };

        vm.showAddPhotoDialog = function(evn) {
            $mdDialog.show({
                targetEvent: evn,
                controller: photoDialogController,
                controllerAs: 'photoDlg',
                clickOutsideToClose: true,
                templateUrl: 'ng/views/dialogs/addPhoto.html'
            }).then(function(newPhoto) {
                vm.dish.photos.push(newPhoto);
                vm.saveDish();
            });
        };

        vm.showAddInstructionDialog = function(evn) {
            $mdDialog.show({
                targetEvent: evn,
                controller: instructionDialogController,
                controllerAs: 'instructionDlg',
                clickOutsideToClose: true,
                templateUrl: 'ng/views/dialogs/addInstruction.html'
            }).then(function(newInstruction) {
                vm.dish.instructions.push(newInstruction);
                DishService.addInstruction($routeParams.dishId, newInstruction).success(function(data) {

                });
            });
        };

        function photoDialogController($mdDialog) {
            var dvm = this;
            dvm.newPhoto = '';

            dvm.closeDialog = function() {
                $mdDialog.cancel();
            };
            dvm.submit = function() {
                $mdDialog.hide(dvm.newPhoto);
            };
        }

        function instructionDialogController($mdDialog) {
            var dvm = this;

            dvm.newInstruction = {
                photo: '',
                text: ''
            };

            dvm.closeDialog = function() {
                $mdDialog.cancel();
            };

            dvm.submit = function() {
                $mdDialog.hide(dvm.newInstruction);
            };
        }

        function init() {
            $scope.setMenuBar({});
            //get the dish by id
            DishService.get($routeParams.dishId).success(function(data) {
                vm.dish = data;
            });

            DishService.getInstructions($routeParams.dishId).success(function(data) {
                vm.dish.instructions = data;
            });

            vm.difficulties = DishService.getDifficulties();
        }

        init();
    });
