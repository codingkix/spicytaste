angular.module('spicyTaste')
    //controller applied to dish list page
    .controller('DishListController', function(DishService, SocialService, $location) {
        var vm = this;

        //grab all the dishes at page load
        DishService.all().success(function(data) {
            //bind the dishes
            vm.dishes = data;
        });

        //function to delete a dish
        vm.deleteDish = function(index) {
            var dish = vm.dishes[index];
            DishService.delete(dish._id).success(function(data) {
                vm.dishes.splice(index, 1);
            });
        };

        vm.addDish = function() {
            DishService.create({
                name: 'new dish'
            }).success(function(data) {
                $location.path('/admin/dishes/' + data.dish._id);
            });
        };

        vm.goToEdit = function(id) {
            $location.path('/admin/dishes/' + id);
        };

    })
    //controller applied to dish detail page
    .controller('DishDetailController', function($scope, $location, $rootScope, $routeParams, $filter, $mdDialog, DishService, UserService, SocialService) {
        var vm = this;
        vm.dish = {};
        init();

        vm.enterFlipBook = function(evn) {
            $mdDialog.show({
                targetEvent: evn,
                clickOutsideToClose: true,
                templateUrl: 'ng/views/dialogs/flipbook.html',
                controller: 'DishDetailController',
                controllerAs: 'book'
            }).finally(function() {
                $rootScope.shownBook = false;
            });

            $rootScope.shownBook = true;
        };

        //call booklet plugin
        $scope.$on('onRepeatLast', function(scope, element, attrs) {
            angular.element(element).parents('#dishBook').booklet({
                width: '100%',
                height: 600,
                closed: true,
                autoCenter: true,
                pageNumbers: false,
                pagePadding: 0,
                hoverWidth: 100
            });
        });

        vm.closeDialog = function() {
            $mdDialog.cancel();
        };

        vm.fbShare = function(dish) {
            var dishLink = $location.absUrl() + '/' + dish._id;
            SocialService.fbShare(dishLink);
        }

        vm.reply = function(user, $event) {
            var commentTitle = '@' + user.userName;
            openCommentDialog(commentTitle, $event, user._id);
        };

        vm.collect = function($event) {
            if (!$rootScope.currentUser) {
                $scope.showLoginDialog($event, true, 'Login/SignUp first to save as favorite').then(function(user) {
                    $rootScope.currentUser = user;

                    UserService.collect(vm.dish._id).then(function(data) {
                        if (data.success) {
                            vm.dish.isCollected = true;
                        }
                    });
                })
            } else {
                UserService.collect(vm.dish._id).then(function(data) {
                    if (data.success) {
                        vm.dish.isCollected = true;
                    }
                });
            }
        }

        vm.showInstructionPhoto = function(photoUrl, $event) {
            if (photoUrl == null || photoUrl.trim() == '')
                return;

            $mdDialog.show({
                targetEvent: $event,
                clickOutsideToClose: true,
                template: '<md-dialog>' +
                    '<md-dialog-content><img src="{{photo}}"></md-dialog-content>' +
                    '</md-dialog>',
                controller: function DialogCtr($scope) {
                    $scope.photo = photoUrl;
                }
            });
        }

        vm.newComment = function($event) {
            if (!$rootScope.currentUser) {
                $scope.showLoginDialog($event, true, 'Login/SignUp first to leave a comment').then(function(user) {
                    $rootScope.currentUser = user;
                    openCommentDialog('Comment', $event, null);
                })
            } else {
                openCommentDialog('Comment', $event, null);
            }
        }

        function init() {
            vm.dish = {};
            vm.relatedDishes = {};

            //get the dish by id
            DishService.get($routeParams.dish_id).success(function(data) {
                vm.dish = data;
                vm.dish.isCollected = false;

                //get the 3 related dishes
                DishService.relate(vm.dish._id, vm.dish.tags, 3).success(function(data) {
                    vm.relatedDishes = data;
                });

                if ($rootScope.currentUser) {
     var found = $filter('filter')($rootScope.currentUser.favouriteDishes, {
         _id: vm.dish._id
     }, true);

     if (found.length) {
         vm.dish.isCollected = true;
     }
 }


            });
        }

        function openCommentDialog(title, $event, replyTo) {
            $mdDialog.show({
                targetEvent: $event,
                clickOutsideToClose: true,
                templateUrl: 'ng/views/dialogs/comment.html',
                locals: {
                    title: title
                },
                controller: commentController,
                controllerAs: 'comment'
            }).then(function(content) {
                DishService.addComment(vm.dish._id, {
                    content: content,
                    replyTo: replyTo
                }).success(function(comment) {
                    vm.dish.comments.push(comment);
                });
            });
        }

        function commentController(title, $mdDialog) {
            var dvm = this;
            dvm.content = '';
            dvm.title = title;

            dvm.closeDialog = function() {
                $mdDialog.cancel();
            }

            dvm.submit = function() {
                if (dvm.content.trim() == '')
                    $mdDialog.cancel()
                else
                    $mdDialog.hide(dvm.content);
            }
        }
    });
