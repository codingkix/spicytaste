angular.module('spicyTaste')
    //controller applied to dish list page
    .controller('DishListController', function(DishService, SocialService, $location) {
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
        }

        vm.fbShare = function(dish) {
            var dishLink = $location.absUrl() + '/' + dish._id;
            SocialService.fbShare(dishLink);
        }

        vm.reply = function(user, $event) {
            var commentTitle = '@' + user.userName;
            openCommentDialog(commentTitle, $event, user._id);
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
            openCommentDialog('Comment', $event, null);
        }

        function init() {
            //get the dish by id
            DishService.get($routeParams.dish_id).success(function(data) {
                vm.dish = data;
                vm.dish.isCollected = false;

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
