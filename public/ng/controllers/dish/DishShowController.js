angular.module('spicyTaste')
    .controller('DishShowController', function(DishService, UserService, CommentService, $interval, $timeout, $routeParams, $filter, $rootScope, $scope) {
        'use strict';

        var vm = this;
        var commentInterval;

        vm.collect = function(event) {
            if (!$rootScope.currentUser) {
                $scope.showLoginDialog(event, true, 'Login or sign up an account to save this recipt as your favourite.').then(function() {
                    UserService.collect(vm.dish._id).success(function() {
                        $rootScope.currentUser.favouriteDishes.push(vm.dish._id);
                        vm.dish.isCollected = true;
                    });
                });
            } else {
                UserService.collect(vm.dish._id).success(function() {
                    $rootScope.currentUser.favouriteDishes.push(vm.dish._id);
                    vm.dish.isCollected = true;
                });
            }

        };

        vm.getAllComments = function() {
            CommentService.getByDish($routeParams.dishId, null).success(function(data) {
                vm.showAllComments = true;
                vm.currentComment = null;
                vm.allComments = data;
            });
        };

        vm.createComment = function($event) {
            if (!$rootScope.currentUser) {
                $scope.showLoginDialog($event, true, 'Login/SignUp first to leave a comment').then(function() {
                    saveComment();
                });
            } else {
                saveComment();
            }
        };

        function saveComment() {
            DishService.addComment(vm.dish._id, {
                content: vm.newComment.content,
                replyTo: vm.newComment.replyTo ? vm.newComment.replyTo._id : null
            }).success(function(comment) {
                vm.newComment = {};
                vm.commentsCount += 1;
                vm.allComments.unshift(comment);
            });
        }

        function getTopComments() {
            //get dish's comments
            CommentService.getByDish($routeParams.dishId, 5).success(function(data) {
                vm.allComments = data;

                if (vm.allComments.length === 1) {
                    vm.currentComment = vm.allComments[0];
                }

                if (vm.allComments.length > 1) {
                    var index = 0;
                    commentInterval = $interval(function() {
                        vm.currentComment = vm.allComments[index];
                        index = ++index % vm.allComments.length;
                    }, 5000);
                }
            });
        }

        function init() {
            vm.dish = {};
            vm.relatedDishes = {};
            vm.currentComment = null;
            vm.newComment = {
                content: ''
            };
            vm.allComments = null;
            vm.progress = 0;
            vm.showDifficulty = true;
            vm.showAllComments = false;



            //get the dish by id
            DishService.get($routeParams.dishId).success(function(data) {
                vm.dish = data;
                vm.dish.isCollected = false;
                vm.backgroundImage = vm.dish.imageUrl;
                vm.dish.difficultyText = 'Difficulty: ' + DishService.getDifficultyText(vm.dish.difficulty);

                if (vm.dish.photos && vm.dish.photos.length > 0) {
                    vm.dish.photos.push(vm.dish.imageUrl);
                    var i = 0;
                    var count = vm.dish.photos.length;

                    var b = $interval(function() {
                        vm.backgroundImage = vm.dish.photos[i];
                        i = ++i % count;
                    }, 6000);
                }

                var n = (vm.dish.difficulty * 20) / 2;
                var p = $interval(function() {
                    vm.progress += 2;
                }, 50, n, true);

                if (vm.dish.instructions.length > 0) {
                    $timeout(function() {
                        vm.showDifficulty = false;
                    }, 3000);
                }

                if ($rootScope.currentUser) {
                    vm.dish.isCollected = $rootScope.currentUser.favouriteDishes.indexOf(vm.dish._id) >= 0;
                }

                //get the 3 related dishes
                // DishService.relate(vm.dish._id, vm.dish.tags, 3).success(function(data) {
                //     vm.relatedDishes = data;
                // });

                // if ($rootScope.currentUser) {
                //     var found = $filter('filter')($rootScope.currentUser.favouriteDishes, {
                //         _id: vm.dish._id
                //     }, true);

                //     if (found.length) {
                //         vm.dish.isCollected = true;
                //     }
                // }

                $scope.$on('$destroy', function() {
                    $interval.cancel(b);
                    $interval.cancel(p);

                    if (angular.isDefined(commentInterval)) {
                        $interval.cancel(commentInterval);
                        commentInterval = undefined;
                    }
                });

            });

            getTopComments();

            //get dish's comments count
            CommentService.countByDish($routeParams.dishId).success(function(data) {
                vm.commentsCount = data;
            });
        }

        init();
    });
