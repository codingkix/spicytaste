angular.module('spicyTaste')
    //controller applied to dish list page
    .controller('DishAdminListController', function(DishService) {
        'use strict';
        var vm = this;

        DishService.all().success(function(data) {
            //bind the dishes
            vm.dishes = data;
        });

        //function to delete a dish
        vm.deleteDish = function(index) {
            var dish = vm.dishes[index];
            DishService.delete(dish._id).success(function() {
                vm.dishes.splice(index, 1);
            });
        };

    });
