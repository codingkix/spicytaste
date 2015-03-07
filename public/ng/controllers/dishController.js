angular.module('dishController', ['dishService'])
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
    })
    //controller applied to dish creation page
    .controller('dishCreateController', function(DishService) {
        var vm = this;

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
    .controller('dishEditController', function($routeParams, DishService) {
        var vm = this;

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
