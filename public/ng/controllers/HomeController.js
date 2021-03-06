angular.module('spicyTaste')
    .controller('HomeController', function($scope, $mdMedia, DishService, CONFIG) {
        'use strict';
        var vm = this;

        function init() {
            $scope.setMenuBar({});

            vm.recipeTiles = [];
            $scope.$watch(function() {
                return $mdMedia('sm');
            }, function(isSmall) {
                $scope.smallScreen = isSmall;
            });

            buildGrid();
        }

        function buildGrid() {
            DishService.limit(CONFIG.LATEST_COUNT).success(function(dishes) {
                angular.forEach(dishes, function(dish, index) {
                    var tile = {
                        image: dish.imageUrl,
                        title: dish.name,
                        id: dish._id,
                        prepTime: dish.prepTime,
                        totalTime: dish.totalTime,
                        difficulty: DishService.getDifficulties()[dish.difficulty - 1],
                        tags: dish.tags,
                        span: {
                            row: 1,
                            col: 1
                        }
                    };

                    switch (index + 1) {
                        case 1:
                            tile.span.row = tile.span.col = 2;
                            break;
                        case 2:
                        case 3:
                            break;
                        case 4:
                            tile.span.col = 2;
                            break;
                        case 5:
                        case 6:
                            break;
                        case 7:
                            tile.span.row = tile.span.col = 2;
                            break;
                        case 8:
                        case 9:
                            break;
                        case 10:
                            tile.span.col = 2;
                            break;
                        default:
                            break;

                    }

                    vm.recipeTiles.push(tile);

                });
            });
        }
        init();

    });
