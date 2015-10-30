angular.module('spicyTaste')
    .controller('DishAllController', function(DishService, $scope) {
        'use strict';

        var vm = this;

        //private functions
        function init() {
            $scope.setMenuBar({});
            vm.searchText = '';
            vm.selectedCategory = '';
            vm.hotSearch = ['seafood', 'dessert', 'spicy', 'breakfast'];
            DishService.all().success(function(data) {
                vm.dishes = prepareData(data);
            });
        }

        function prepareData(data) {

            for (var i = 0; i < data.length; i++) {
                if (data[i].blog && data[i].blog.length > 300) {
                    data[i].blog = data[i].blog.substring(0, 299) + ' ...';
                }
            }

            return data;
        }

        //public functions
        vm.search = function() {
            if (vm.searchText.trim() === '') {
                return;
            }
            DishService.search(vm.searchText).success(function(data) {
                vm.dishes = prepareData(data);
            });
        };

        vm.selectCategory = function(category) {
            vm.selectedCategory = category;
            DishService.searchByCategory(category).success(function(data) {
                vm.dishes = prepareData(data);
            });
        };

        vm.showAll = function() {
            init();
        };

        init();
    });
