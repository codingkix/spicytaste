angular.module('spicyTaste')
    .controller('DishEditController', function($scope, $mdDialog, $mdToast, $routeParams, DishService, $location, $timeout) {
        'use strict';
        var vm = this;

        vm.submitNext = function(formDirty) {
            if (formDirty) {
                DishService.update($routeParams.dishId, vm.dish).success(function(result) {
                    if (result.success) {
                        showStatusToast(true, 'Recipt Info Is Updated.');
                        changeWizardStatus();

                    } else {
                        showStatusToast(false, 'Error, please try again.');
                    }
                });
            } else {
                changeWizardStatus();
            }

        };

        vm.submitPhotos = function() {
            DishService.submitPhotos($routeParams.dishId, vm.dish.photos).success(function(result) {
                if (result.success) {
                    if (vm.wizardMode) {
                        vm.wizardMode = false;
                    }
                    vm.showBottomSheet = false;
                    showStatusToast(true, 'Recipt Photos Are Updated.');
                } else {
                    showStatusToast(false, 'Error, please try again.');
                }
            });
        };

        vm.removePhoto = function(index) {
            vm.dish.photos[index] = '';
        };

        function changeWizardStatus() {
            if (vm.wizardMode) {
                if (vm.showRightPanel) {
                    vm.showBottomSheet = true;
                    vm.showHeroButtons = true;
                } else if (vm.showLeftPanel) {
                    vm.showRightPanel = true;
                }
            }
        }

        function showStatusToast(isSuccess, message) {
            $mdToast.show({
                controller: function($scope) {
                    $scope.content = message;
                    $scope.isSuccess = isSuccess;
                },
                templateUrl: 'ng/views/templates/toast.html',
                hideDelay: 2000,
                position: 'top right'
            });
        }

        function init() {
            $scope.setMenuBar({});

            vm.showBottomSheet = false;

            //prevent error logs by md-chips
            vm.dish = {
                tags: [],
                ingredients: []
            };

            if ($location.search().wizardMode === 'true') {
                vm.wizardMode = true;
            }

            $timeout(function() {
                vm.showLeftPanel = true;
            }, 500);

            //get the dish by id
            DishService.getDishWithInstructions($routeParams.dishId).success(function(data) {
                vm.dish = data;

                if (!vm.dish.photos) {
                    vm.dish.photos = [];
                }
                var photoCount = vm.dish.photos.length;
                for (var i = photoCount; i < 4; i++) {
                    vm.dish.photos.push('');
                }
            });
            vm.difficulties = DishService.getDifficulties();
        }

        init();
    });
