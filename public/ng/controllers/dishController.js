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

        vm.addDish = function() {
            vm.processing = true;

            DishService.create({
                name: 'new dish'
            }).success(function(data) {
                $location.path('/admin/dish/' + data.dish._id);
            });
        }

    })
    //controller applied to dish detail page
    .controller('DishDetailController', function($scope, $location, $rootScope, $routeParams, DishService, UserService) {
        var vm = this;
        vm.dish = {};
        init();

        //get the dish by id
        DishService.get($routeParams.dish_id).success(function(data) {
            vm.dish = data;
            if ($rootScope.user && $rootScope.user.favouriteDishes.indexOf(vm.dish._id) >= 0) {
                vm.dish.isCollected = true;
            } else {
                vm.dish.isCollected = false;
            }

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

        vm.collect = function() {
            if (!$rootScope.user) {
                var returnUrl = $location.url();
                return $location.path('/login').search({
                    returnUrl: returnUrl
                });
            }

            UserService.collect(vm.dish._id).then(function(data) {
                console.log("UserService.collect:", data);

                if (data.success) {
                    vm.dish.isCollected = true;
                }
            });
        }

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
    //not use anymore
    .controller('DishCreateController', function($location, DishService) {
        var vm = this;

        vm.dish = {
            name: 'new dish'
        };

        vm.save = function() {
            vm.processing = true;

            DishService.create(vm.dish).success(function(data) {
                $location.path('/admin/dish/' + data.dish._id);
            });
        };



        function init() {
            vm.type = 'create';
            vm.dish = {
                instructions: [],
                photo: []
            };
            vm.newInstruction = '';
            vm.newPhoto = '';
            vm.message = '';
            vm.processing = false;
            vm.dish.instructions.length = 0;
            vm.dish.photos.length = 0;
        }
    })
    //controller applied to dish edit page
    .controller('DishEditController', function($routeParams, DishService, $location) {
        var vm = this;
        init();

        //get the dish by id
        DishService.get($routeParams.dish_id).success(function(data) {
            vm.dish = data;
        });

        vm.addInstruction = function() {
            vm.dish.instructions.push(vm.newInstruction);
            vm.newInstruction = '';
        }

        vm.removeInstruction = function(index) {
            vm.dish.instructions.splice(index, 1);
        }

        vm.addPhoto = function() {
            console.log("newPhoto: ", vm.newPhoto);
            vm.dish.photos.push(vm.newPhoto);
            console.log("dish:", vm.dish);
            vm.newPhoto = '';
        }

        vm.removePhoto = function(index) {
            vm.dish.photos.splice(index, 1);
        }

        vm.save = function() {
            vm.processing = true;

            DishService.update($routeParams.dish_id, vm.dish).success(function(data) {
                init();
                vm.message = data.message;
            })
        }

        function init() {
            vm.newPhoto = '';
            vm.newInstruction = '';
            vm.message = '';
            vm.processing = false;
        }
    });
