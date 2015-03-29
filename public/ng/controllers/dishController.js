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
    //controller applied to dish detail page
    .controller('DishDetailController', function($scope, $location, $rootScope, $routeParams, DishService, UserService) {
        var vm = this;
        vm.dish = null;
        init();

        //get the dish by id
        DishService.get($routeParams.dish_id).success(function(data) {
            vm.dish = data;
        });

        vm.addComment = function() {
            if (!$rootScope.user) {
                var returnUrl = $location.url();
                return $location.path('/login').search({
                    returnUrl: returnUrl
                });
            }

            DishService.addComment(vm.dish._id, vm.newComment).success(function(comment) {
                vm.dish.comments.push(comment);
            });

            init();
        };

        vm.reply = function(user) {
            vm.newComment.replyTo = user._id;
            vm.commentTitle = '@' + user.userName;
            $scope.focusOnComment = true;
        };

        function init() {
            $scope.focusOnComment = false;
            vm.newComment = {
                content: '',
                replyTo: null,
            };
            vm.commentTitle = 'Comment';
        }
    })
    //controller applied to dish creation page
    .controller('DishCreateController', function(DishService) {
        var vm = this;

        init();

        vm.save = function() {
            vm.processing = true;

            DishService.create(vm.dish).success(function(data) {
                init();
                vm.message = data.message;
            });
        };

        vm.addInstruction = function() {
            vm.dish.instructions.push(vm.newInstruction);
            vm.newInstruction = '';
        }

        vm.removeInstruction = function(index) {
            vm.dish.instructions.splice(index, 1);
        }

        function init() {
            vm.type = 'create';
            vm.dish = {
                instructions: []
            };
            vm.newInstruction = '';
            vm.message = '';
            vm.processing = false;
            vm.dish.instructions.length = 0;
        }
    })
    //controller applied to dish edit page
    .controller('DishEditController', function($routeParams, DishService, $location) {
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

                vm.message = data.message;
            })
        }
    });
