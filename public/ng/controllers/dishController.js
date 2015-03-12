angular.module('spicyTaste')
    //controller applied to dish list page
    .controller('DishListController', function(DishService) {
        var vm = this;

        //set a processing variable to show loading
        vm.processing = true;

        //grab all the dishes at page load
        DishService.all().success(function(data) {
            //when all dishes fetched, remove processing variable
            vm.processing = false;

            //bind the dishes
            vm.dishes = data;
        });

        //function to delete a dish
        vm.deleteDish = function(id) {
            vm.processing = true;

            DishService.delete(id).success(function(data) {
                DishService.all().success(function(data) {
                    vm.processing = false;
                    vm.dishes = data;
                });
            });
        };
    })
    //controller applied to dish creation page
    .controller('DishCreateController', function(DishService) {
        var vm = this;

        vm.type = "create";

        vm.save = function() {
            vm.processing = true;
            vm.message = '';

            DishService.create(vm.dish).success(function(data) {
                vm.processing = false;
                vm.dish = {};
                vm.message = data.message;
            });
        };
    })
    //controller applied to dish edit page
    .controller('DishEditController', function($routeParams, DishService) {
        var vm = this;

        vm.type = "edit";

        //get the dish by id
        DishService.get($routeParams.dish_id).success(function(data) {
            vm.dish = data;
        });

        vm.save = function() {
            vm.processing = true;
            vm.message = '';

            DishService.update($routeParams.dish_id, vm.dish).success(function(data) {
                vm.processing = false;

                vm.dish = {};
                vm.message = data.message;
            })
        }
    });
