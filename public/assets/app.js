angular.module('spicyTaste', ['ngRoute', 'angular-md5', 'ngMaterial', 'ngAnimate', 'ngMessages'])
    .constant('CONSTANTS', {
        "FB_APP_ID": 1563567387253468,
        "FACEBOOK": "FB",
        "EMAIL": "EMAIL",
        "SOCIAL_PASS": "P@ssw0rd",
        "LOCAL_STORAGE_KEY": "spicyTasteUser",
        "LATEST_COUNT": 10
    });

angular.module('spicyTaste')
    .config(["$mdThemingProvider", "$mdIconProvider", function($mdThemingProvider, $mdIconProvider) {
        'use strict';

        var primaryOrange = $mdThemingProvider.extendPalette('deep-orange', {
            '500': 'f27242'
        });

        var primaryBlue = $mdThemingProvider.extendPalette('blue', {
            '500': '6984b4',
            '600': '6984b4'
        });

        $mdThemingProvider.definePalette('primaryOrange', primaryOrange);
        $mdThemingProvider.definePalette('primaryBlue', primaryBlue);

        $mdThemingProvider.theme('default')
            .primaryPalette('primaryOrange')
            .accentPalette('light-green');

        $mdThemingProvider.theme('blue')
            .primaryPalette('primaryBlue');

        $mdIconProvider.icon('menu', 'svg/ic_menu_24px.svg')
            .icon('share', 'svg/ic_share_48px.svg')
            .icon('login', 'svg/ic_account_circle_24px.svg')
            .icon('recipes', 'svg/ic_event_note_48px.svg')
            .icon('restaurants', 'svg/ic_restaurant_menu_48px.svg')
            .icon('ingredients', 'svg/ic_receipt_48px.svg')
            .icon('arrow', 'svg/ic_arrow_drop_up_48px.svg')
            .icon('more', 'svg/ic_more_24px.svg')
            .icon('time1', 'svg/ic_av_timer_24px.svg')
            .icon('time2', 'svg/ic_access_time_24px.svg')
            .icon('exit', 'svg/ic_exit_to_app_48px.svg')
            .icon('photo', 'svg/ic_mms_24px.svg')
            .icon('check', 'svg/ic_check_circle_24px.svg')
            .icon('facebook', 'svg/facebook.svg')
            .icon('twitter', 'svg/twitter.svg')
            .icon('pinterest', 'svg/pinterest.svg')
            .icon('comments', 'svg/ic_chat_48px.svg')
            .icon('menu', 'svg/ic_menu_48px.svg')
            .icon('favorite', 'svg/ic_favorite_24px.svg')
            .icon('delete', 'svg/ic_delete_48px.svg')
            .icon('add', 'svg/ic_add_circle_outline_48px.svg')
            .icon('arrow-down', 'svg/ic_expand_more_48px.svg')
            .icon('play', 'svg/ic_play_circle_outline_48px.svg')
            .icon('search', 'svg/ic_search_48px.svg')
            .icon('pin', 'svg/ic_attach_file_48px.svg')
            .icon('clear', 'svg/ic_clear_all_48px.svg')
            .icon('next', 'svg/ic_chevron_right_48px.svg')
            .icon('pre', 'svg/ic_chevron_left_48px.svg')
            .icon('edit', 'svg/ic_edit_48px.svg');
    }]);

angular.module('spicyTaste')
    .run(["$rootScope", "$location", "$window", "CONSTANTS", "UserService", function($rootScope, $location, $window, CONSTANTS, UserService) {
        'use strict';

        $window.fbAsyncInit = function() {
            FB.init({
                appId: CONSTANTS.FB_APP_ID,
                cookie: true, // enable cookies to allow the server to access the session
                xfbml: true, // parse social plugins on this page
                version: 'v2.2' // use version 2.2
            });
        };

        // Load the SDK asynchronously
        (function(d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {
                return;
            }
            js = d.createElement(s);
            js.id = id;
            js.src = '//connect.facebook.net/en_US/sdk.js';
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));

        //Check Authorization
        $rootScope.$on('$routeChangeStart', function(event, next) {
            if (next && next.access) {
                UserService.authorize(next.access.requirePermissions).then(function(result) {
                    if (!result) {
                        $location.path('not-authorize').replace();
                    }
                });
            }
        });
    }]);

angular.module('spicyTaste')
    .config(["$locationProvider", "$routeProvider", function($locationProvider, $routeProvider) {
        'use strict';

        $locationProvider.html5Mode(true);

        $routeProvider
        //home page
            .when('/', {
                templateUrl: 'ng/views/pages/home.html',
                controller: 'HomeController',
                controllerAs: 'home'
            })
            .when('/themes/:name', {
                templateUrl: '/ng/views/pages/themes/show.html',
                controller: 'ThemeShowController',
                controllerAs: 'themeShow'
            })
            //show all dishes page
            .when('/recipts', {
                templateUrl: 'ng/views/pages/dish/all.html',
                controller: 'DishAllController',
                controllerAs: 'dishAll'
            })
            //show dish detail page
            .when('/dishes/:dishId', {
                templateUrl: 'ng/views/pages/dish/show.html',
                controller: 'DishShowController',
                controllerAs: 'dishShow'
            })
            .when('/dishes/:dishId/instructions', {
                templateUrl: 'ng/views/pages/dish/instruction.html',
                controller: 'DishInstructionController',
                controllerAs: 'dishInstruction'
            })
            //list admin themes page
            .when('/admin/themes', {
                templateUrl: '/ng/views/pages/admin/theme/list.html',
                controller: 'ThemeAdminListController',
                controllerAs: 'themeList',
                access: {
                    requirePermissions: ['Admin']
                }
            })
            //edit a theme page
            .when('/admin/themes/:id', {
                templateUrl: 'ng/views/pages/admin/theme/edit.html',
                controller: 'ThemeAdminEditController',
                controllerAs: 'themeEdit',
                access: {
                    requirePermissions: ['Admin']
                }
            })
            //list admin dish page
            .when('/me/dishes', {
                templateUrl: 'ng/views/pages/admin/dish/list.html',
                controller: 'DishListController',
                controllerAs: 'dishList'
            })
            //edit a dish page
            .when('/me/dishes/:dishId', {
                templateUrl: 'ng/views/pages/dish/edit.html',
                controller: 'DishEditController',
                controllerAs: 'dishManage'
            })
            //login user
            .when('/login', {
                templateUrl: 'ng/views/pages/user/login.html',
                controller: 'LoginController',
                controllerAs: 'login'
            })
            //user profile
            .when('/me', {
                templateUrl: 'ng/views/pages/user/me.html',
                controller: 'ProfileController',
                controllerAs: 'profile'
            })
            .when('/not-authorize', {
                templateUrl: 'ng/views/pages/not-authorize.html'
            });
    }]);

angular.module('spicyTaste')
    .controller('HomeController', ["$scope", "$mdMedia", "DishService", "CONSTANTS", function($scope, $mdMedia, DishService, CONSTANTS) {
        var vm = this;
        init();

        function init() {
            vm.recipeTiles = [];
            $scope.$watch(function() {
                return $mdMedia('sm');
            }, function(isSmall) {
                $scope.smallScreen = isSmall;
            });

            buildGrid();
        }

        function buildGrid() {
            DishService.limit(CONSTANTS.LATEST_COUNT).success(function(dishes) {
                angular.forEach(dishes, function(dish, index) {
                    var tile = {
                        image: dish.imageUrl,
                        title: dish.name,
                        id: dish._id,
                        prepTime: dish.prepTime,
                        totalTime: dish.totalTime,
                        difficulty: dish.difficulty,
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
                        case 5:
                        case 6:
                            break;
                        case 7:
                            tile.span.row = tile.span.col = 2;
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

    }]);

angular.module('spicyTaste')
    .controller('MainController', ["$rootScope", "$scope", "$location", "$mdDialog", "$http", "SessionService", "UserService", "CONSTANTS", function($rootScope, $scope, $location, $mdDialog, $http, SessionService, UserService, CONSTANTS) {
        'use strict';
        var vm = this;

        vm.toggleMobileMenu = function() {
            vm.showMobileMenu = !vm.showMobileMenu;
        };

        $scope.setMenuBar = function(menuBar) {
            angular.extend(vm.menuBar, vm.defaultMenu, menuBar);
        };

        $scope.showLoginDialog = function(ev, postLogin, title) {
            var promise = $mdDialog.show({
                clickOutsideToClose: true,
                templateUrl: 'ng/views/dialogs/login.html',
                targetEvent: ev,
                controller: loginController,
                controllerAs: 'login',
                locals: {
                    dialogTitle: title
                }
            });
            if (postLogin) {
                return promise;
            } else {
                promise.then(function(user) {
                    $rootScope.currentUser = user;
                });
            }
        };

        function loginController(dialogTitle, $mdDialog, UserService, md5) {
            var dvm = this;
            dvm.title = dialogTitle;
            dvm.email = '';
            dvm.password = '';
            dvm.userName = '';

            dvm.fbLogin = function() {
                FB.login(function(response) {
                    if (response.status === 'connected') {
                        // Logged into your app and Facebook.
                        FB.api('/me', function(response) {
                            var fbUser = {
                                userName: response.name,
                                email: response.email,
                                password: CONSTANTS.SOCIAL_PASS,
                                photoUrl: 'http://graph.facebook.com/' + response.id + '/picture?type=large',
                                linkedSocial: CONSTANTS.FACEBOOK
                            };

                            UserService.socialLogin(fbUser).then(function(user) {
                                user.loginType = CONSTANTS.FACEBOOK;
                                afterAuth(user);
                            });

                        });
                    } else if (response.status === 'not_authorized') {
                        // The person is logged into Facebook, but not your app.
                    } else {
                        // The person is not logged into Facebook, so we're not sure if
                        // they are logged into this app or not.
                    }
                }, {
                    scope: 'public_profile,email'
                });
            };

            dvm.login = function() {
                UserService.login(dvm.email, dvm.password).then(function(user) {
                    user.loginType = CONSTANTS.EMAIL;
                    afterAuth(user);
                });
            };

            dvm.signUp = function() {
                var newUser = {
                    userName: dvm.userName,
                    email: dvm.email,
                    password: dvm.password,
                    photoUrl: 'http://www.gravatar.com/avatar/' + md5.createHash(dvm.email),
                    linkedSocial: CONSTANTS.EMAIL
                };

                UserService.create(newUser).then(function(user) {
                    user.loginType = CONSTANTS.EMAIL;
                    afterAuth(user);
                });

            };

            function afterAuth(user) {
                var token = $http.defaults.headers.common['X-Auth'];
                SessionService.setLocal(CONSTANTS.LOCAL_STORAGE_KEY, token);
                $mdDialog.hide(user);
            }
        }
        loginController.$inject = ["dialogTitle", "$mdDialog", "UserService", "md5"];

        function init() {
            vm.showMobileMenu = false;
            vm.scrollTargetReached = false;
            vm.defaultMenu = {
                primaryTheme: false,
                hidden: false,
                text: 'SPICY TASTE'
            };
            vm.menuBar = {};

            var loginedToken = SessionService.getLocal(CONSTANTS.LOCAL_STORAGE_KEY);
            if (loginedToken) {
                console.log('token', loginedToken);

                $http.defaults.headers.common['X-Auth'] = loginedToken;
                UserService.getCurrentUser().then(function(user) {
                    $rootScope.currentUser = user;
                });
            }
        }

        init();


    }]);

angular.module('spicyTaste')
    .controller('ProfileController', ["$location", "$scope", "$rootScope", "$timeout", "UserService", "DishService", function($location, $scope, $rootScope, $timeout, UserService, DishService) {
        'use strict';

        var vm = this;

        vm.logout = function() {
            UserService.logout();
            $rootScope.currentUser = null;
            $location.path('/');
        };

        vm.getRecipts = function() {
            $scope.showSpinner = true;
            DishService.searchByAuthor($rootScope.currentUser._id).success(function(data) {
                vm.allRecipts = data;
            });
        };

        vm.newRecipt = function() {
            DishService.create({
                name: 'new recipt'
            }).success(function(data) {
                $location.path('/me/dishes/' + data.dish._id);
            });
        };

        $scope.$on('onRepeatLast', function() {
            $timeout(function() {
                $scope.showSpinner = false;
            }, 400);
        });

        function init() {
            $scope.setMenuBar({
                primaryTheme: true
            });

            UserService.getProfile().success(function(data) {
                vm.user = data.user;
                vm.reciptsCount = data.reciptsCount;
            });
        }

        init();
    }]);

angular.module('spicyTaste')
    //controller applied to dish list page
    .controller('DishListController', ["DishService", "SocialService", "$location", function(DishService, SocialService, $location) {
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

    }])
    //controller applied to dish detail page
    .controller('DishDetailController', ["$scope", "$location", "$rootScope", "$routeParams", "$filter", "$mdDialog", "DishService", "UserService", "SocialService", function($scope, $location, $rootScope, $routeParams, $filter, $mdDialog, DishService, UserService, SocialService) {
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
        }

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
                controller: ["$scope", function DialogCtr($scope) {
                    $scope.photo = photoUrl;
                }]
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
        commentController.$inject = ["title", "$mdDialog"];
    }]);

angular.module('spicyTaste')
    .directive('contenteditable', function() {
        return {
            require: 'ngModel',
            restrict: 'A',
            link: function(scope, element, attributs, ngModel) {
                ngModel.$render = function() {
                    element.html(ngModel.$viewValue || '');
                };

                element.bind('blur', function() {
                    scope.$apply(function() {
                        ngModel.$setViewValue(element.html());
                    });
                });
            }
        };
    });

angular.module('spicyTaste')
    .directive('flipbook', function() {
        return {
            transclude: false,
            restrict: 'E',
            replace: true,
            templateUrl: 'ng/views/templates/flipbook.html',
            scope: {
                dish: '='
            }
        }
    })

angular.module('spicyTaste')
    .directive('focus', function() {
        'use strict';

        return {
            restrict: 'A',
            scope: {
                trigger: '@focus'
            },
            link: {
                post: function($scope, $element) {
                    $scope.$watch('trigger', function(newVal) {
                        if (newVal === 'true') {
                            $element[0].focus();
                        }
                    });
                }
            }
        };
    });

angular.module('spicyTaste')
    .directive('focusOn', function() {
        return {
            restrict: 'A',
            scope: {
                focusValue: "=focusOn"
            },
            link: function($scope, $element) {
                $scope.$watch('focusValue', function(currentValue, previousValue) {
                    if (currentValue && !previousValue) {
                        $element[0].focus();
                    }
                });
            }
        };
    });

angular.module('spicyTaste')
    .directive('onLastRepeat', ["$timeout", function($timeout) {
        'use strict';
        return function($scope, $element, $attrs) {
            if ($scope.$last) {
                $timeout(function() {
                    $scope.$emit('onRepeatLast', $element, $attrs);
                }, 0);
            }
        };
    }]);

angular.module('spicyTaste')
    .directive('originalSrc', function() {
        'use strict';

        return {
            restrict: 'A',
            scope: {
                originalSrc: '@'
            },
            link: function(scope, element, attrs) {
                element.on('load', function() {
                    element.attr('src', scope.originalSrc);
                    element.css('background', 'none');
                });
            }
        };
    });

angular.module('spicyTaste')
    .directive('scrollTo', function() {
        return {
            restrict: 'A',
            link: function(scope, $element, attrs) {
                var $target = $(attrs.scrollTo);
                $element.on('click', function() {
                    $('html, body').animate({
                        scrollTop: $target.offset().top
                    }, 600);
                });
            }
        };
    });

angular.module('spicyTaste')
    .directive('showTime', ["$window", "UtilityService", function($window, UtilityService) {
        'use strict';
        return {
            restrict: 'A',
            scope: true,
            link: function(scope, $element, $attrs) {
                var showTime = scope.$eval($attrs.showTime);
                var offset = 0;
                if (!angular.isUndefined(showTime)) {
                    offset = showTime.offset;
                }

                var onScrollDebounced = UtilityService.debounce(function() {
                    if ($element.hasClass('viewed')) {
                        return;
                    }

                    var docTop = angular.element($window).scrollTop();
                    var docBottom = docTop + angular.element($window).height();

                    var elemTop = $element.offset().top;
                    var elemBottom = elemTop + $element.height();

                    if (offset !== 0) {
                        if (docTop - elemTop >= 0) {
                            // scrolling up from bottom
                            elemTop += offset;
                        } else {
                            // scrolling down from top
                            elemBottom -= offset;
                        }
                    }

                    if (elemBottom <= docBottom && elemTop >= docTop) {
                        $element.removeClass('notViewed').addClass('viewed');
                    }
                }, 200, true);

                angular.element($window).on('scroll', onScrollDebounced);

                scope.$on('$destroy', onScrollDebounced);
            }
        };
    }]);

angular.module('spicyTaste')
    .directive('socialShares', ["SocialService", "$location", function(SocialService, $location) {
        'use strict';
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'ng/views/templates/socialShares.html',
            link: function($scope, $element, $attr) {
                $element.find('#btnFB').click(function() {
                    SocialService.fbShare($location.absUrl());
                });

                //TODO: other shares
            }
        };
    }]);

angular.module('spicyTaste')
    .directive('topMenuReached', ["$window", "UtilityService", function($window, UtilityService) {
        'use strict';
        return {
            restrict: 'A',
            scope: true,
            link: function(scope, $element, attrs) {
                var offset = $element.offset().top - 64;
                var defaultMenuBar = {
                    primaryTheme: false,
                    hidden: false,
                    text: 'spicy taste'
                };
                var menuBar = scope.$eval(attrs.topMenuReached);
                //check if the top menu is already reaching the element.
                var yOffset = $window.pageYOffset;
                if (yOffset >= offset) {
                    scope.setMenuBar(menuBar);
                }

                var onScrollDebounced = UtilityService.debounce(function() {
                    console.log('debounce called');
                    if ($window.pageYOffset >= offset) {
                        scope.setMenuBar(menuBar);
                    } else {
                        scope.setMenuBar(defaultMenuBar);
                    }
                    scope.$apply();
                }, 150);

                angular.element($window).on('scroll', onScrollDebounced);

                scope.$on('$destroy', onScrollDebounced);
            }
        };
    }]);

angular.module('spicyTaste')
    .factory('CommentService', ["$http", function($http) {
        'use strict';
        var commentFactory = {};
        var baseUrl = '/api/comments';

        commentFactory.getByDish = function(dishId, limit) {
            var routeUrl = baseUrl + '?dishId=' + dishId;
            if (limit) {
                routeUrl += '&limit=' + limit;
            }
            return $http.get(routeUrl);
        };

        commentFactory.countByDish = function(dishId) {
            return $http.get(baseUrl + '/count/?dish=' + dishId);
        };

        return commentFactory;
    }]);

angular.module('spicyTaste')
    .factory('DishService', ["$http", function($http) {
        'use strict';
        //create a new object
        var dishFactory = {};
        var baseUrl = '/api/dishes/';

        //get all dishes
        dishFactory.all = function() {
            return $http.get(baseUrl);
        };

        //search dishes
        dishFactory.search = function(search) {
            return $http.get(baseUrl + '?search=' + search);
        };

        //search by category
        dishFactory.searchByCategory = function(category) {
            return $http.get(baseUrl + '?category=' + category);
        };

        //search by author
        dishFactory.searchByAuthor = function(userId) {
            return $http.get(baseUrl + '?createdBy=' + userId);
        };

        //get limited latest dishes
        dishFactory.limit = function(num) {
            return $http.get(baseUrl + '?limit=' + num);
        };

        //get related dishes by tags
        dishFactory.relate = function(id, tags, num) {
            return $http({
                method: 'GET',
                url: '/api/dishes',
                params: {
                    id: id,
                    limit: num,
                    'tags[]': tags
                }
            });
        };

        //create a dish
        dishFactory.create = function(dish) {
            return $http.post(baseUrl, dish);
        };

        //get a single dish with comments
        dishFactory.get = function(dishId) {
            return $http.get(baseUrl + dishId);
        };

        //update a dish
        dishFactory.update = function(dishId, dish) {
            return $http.put(baseUrl + dishId, dish);
        };

        //delete a dish
        dishFactory.delete = function(dishId) {
            return $http.delete(baseUrl + dishId);
        };

        //add a comment
        dishFactory.addComment = function(dishId, comment) {
            return $http.post(baseUrl + dishId + '/comments', comment);
        };

        //get all instructions
        dishFactory.getInstructions = function(dishId) {
            return $http.get(baseUrl + dishId + '/instructions');
        };

        //add a instruction
        dishFactory.addInstruction = function(dishId, instruction) {
            return $http.post(baseUrl + dishId + '/instructions', instruction);
        };

        //remove an instruction
        dishFactory.removeInstruction = function(dishId, instructionId) {
            return $http.delete(baseUrl + dishId + '/instructions/' + instructionId);
        };

        //get difficulty
        dishFactory.getDifficulties = function() {
            return ['初学', '容易', '一般', '较难', '专业'];
        };

        return dishFactory;
    }]);

angular.module('spicyTaste')
    .factory('SessionService', ["$window", function($window) {
        var sessionFactory = {};

        sessionFactory.getLocal = function(key) {
            if ($window.localStorage) {
                var data = $window.localStorage.getItem(key);

                return angular.fromJson(data);
            }
            return false;
        }

        sessionFactory.setLocal = function(key, data) {
            return $window.localStorage && $window.localStorage.setItem(key, angular.toJson(data));
        }

        return sessionFactory;

    }]);

angular.module('spicyTaste')
    .factory('SocialService', function() {
        var socialFactory = {};

        socialFactory.fbShare = function(link) {
            FB.ui({
                method: 'share',
                href: link,
            }, function(response) {});
        }

        return socialFactory;
    });

angular.module('spicyTaste')
    .factory('ThemeService', ["$http", "$filter", function($http, $filter) {
        'use strict';

        var themeFactory = {};

        themeFactory.getAll = function() {
            return $http.get('/api/themes');
        };

        themeFactory.get = function(id) {
            return $http.get('/api/themes/' + id);
        };

        themeFactory.searchBy = function(query) {
            return $http.get('/api/themes/?' + query);
        };

        themeFactory.create = function(theme) {
            return $http.post('/api/themes/', theme);
        };

        themeFactory.update = function(id, theme) {
            return $http.put('/api/themes/' + id, theme);
        };

        themeFactory.getOthers = function(name, num) {
            var query = 'limit=' + (num + 1);
            return themeFactory.searchBy(query).then(function(response) {
                var others = $filter('filter')(response.data, {
                    name: name
                }, function(actual, expected) {
                    return expected.toLowerCase().trim() !== actual.toLowerCase().trim();
                });

                if (others.length > num) {
                    return others.splice(0, 1);
                }

                return others;
            });
        };

        return themeFactory;
    }]);

angular.module('spicyTaste')
    .factory('UserService', ["$http", "$rootScope", "$window", "CONSTANTS", function($http, $rootScope, $window, CONSTANTS) {
        'use strict';

        var userFactory = {};
        var baseUrl = '/api/users/';
        //social login
        userFactory.socialLogin = function(socialUser) {
            return userFactory.searchBy('email=' + socialUser.email).then(function(data) {

                if (!data.success) {
                    //not found, then create
                    return userFactory.create(socialUser);
                } else {
                    //found the user with email
                    return userFactory.login(socialUser.email, CONSTANTS.SOCIAL_PASS);
                }
            });
        };

        //login user
        userFactory.login = function(email, password) {

            return $http.post('/api/auth', {
                email: email,
                password: password
            }).then(function(response) {
                $http.defaults.headers.common['X-Auth'] = response.data.token;
                return userFactory.getById(response.data.userId);
            });
        };

        //logout user
        userFactory.logout = function() {
            delete $http.defaults.headers.common['X-Auth'];
            $window.localStorage.removeItem(CONSTANTS.LOCAL_STORAGE_KEY);
            userFactory.loginedUser = null;
        };

        //search user by field
        userFactory.searchBy = function(query) {
            return $http.get('/api/users?' + query).then(function(response) {
                return response.data;
            });
        };

        userFactory.getCurrentUser = function() {
            return $http.get('/api/me').then(function(response) {
                return userFactory.getById(response.data);
            });
        };

        //get user by id
        userFactory.getById = function(userId) {
            return $http.get(baseUrl + userId).then(function(response) {
                return response.data;
            });
        };

        //get user full profile
        userFactory.getProfile = function() {
            return $http.get('/api/me/profile');
        };
        //create a new user
        userFactory.create = function(user) {
            return $http.post(baseUrl, user).then(function() {
                return userFactory.login(user.email, user.password);
            });
        };

        //update user
        userFactory.update = function(user) {
            return $http.put(baseUrl + user.userId, user).then(function(response) {
                return response.data;
            });
        };

        //collect dish as favourite
        userFactory.collect = function(dishId) {
            return $http.put(baseUrl + $rootScope.currentUser._id + '/dishes/' + dishId).then(function(response) {
                return response.data;
            });
        };

        //authorize user
        userFactory.authorize = function(requirePermissions) {
            return userFactory.getCurrentUser().then(function(user) {
                if (user && requirePermissions.indexOf(user.role) >= 0) {
                    return true;
                } else {
                    return false;
                }
            }, function(response) {
                console.log('err', response);
                return false;
            });
        };

        return userFactory;
    }]);

angular.module('spicyTaste')
    .factory('UtilityService', function() {
        'use strict';

        var utilityFactory = {};

        utilityFactory.debounce = function(func, wait, immediate) {
            var timeout;

            return function() {
                var context = this,
                    args = arguments;
                var later = function() {
                    timeout = null;
                    if (!immediate) {
                        func.apply(context, args);
                    }
                };
                var callNow = immediate && !timeout;
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
                if (callNow) {
                    func.apply(context, args);
                }
            };
        };
        return utilityFactory;
    });

angular.module('spicyTaste')
    .controller('DishAllController', ["DishService", "$scope", function(DishService, $scope) {
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
    }]);

angular.module('spicyTaste')
    .controller('DishEditController', ["$scope", "$mdDialog", "$routeParams", "DishService", "$location", "$timeout", function($scope, $mdDialog, $routeParams, DishService, $location, $timeout) {
        'use strict';
        var vm = this;

        vm.saveDish = function() {
            DishService.update($routeParams.dishId, vm.dish).success(function(data) {
                if (data.success) {
                    vm.updateSuccess = true;
                }
                $timeout(function() {
                    vm.updateSuccess = false;
                }, 1000);
            });
        };
        vm.removeInstruction = function(index) {
            console.log('instructions', vm.dish.instructions[index]);
            DishService.removeInstruction($routeParams.dishId, vm.dish.instructions[index]._id).success(function(data) {
                vm.dish.instructions.splice(index, 1);
            });
        };

        vm.removePhoto = function(index) {
            vm.dish.photos.splice(index, 1);
            vm.saveDish();
        };

        vm.showAddPhotoDialog = function(evn) {
            $mdDialog.show({
                targetEvent: evn,
                controller: photoDialogController,
                controllerAs: 'photoDlg',
                clickOutsideToClose: true,
                templateUrl: 'ng/views/dialogs/addPhoto.html'
            }).then(function(newPhoto) {
                vm.dish.photos.push(newPhoto);
                vm.saveDish();
            });
        };

        vm.showAddInstructionDialog = function(evn) {
            $mdDialog.show({
                targetEvent: evn,
                controller: instructionDialogController,
                controllerAs: 'instructionDlg',
                clickOutsideToClose: true,
                templateUrl: 'ng/views/dialogs/addInstruction.html'
            }).then(function(newInstruction) {
                vm.dish.instructions.push(newInstruction);
                DishService.addInstruction($routeParams.dishId, newInstruction).success(function(data) {

                });
            });
        };

        function photoDialogController($mdDialog) {
            var dvm = this;
            dvm.newPhoto = '';

            dvm.closeDialog = function() {
                $mdDialog.cancel();
            };
            dvm.submit = function() {
                $mdDialog.hide(dvm.newPhoto);
            };
        }
        photoDialogController.$inject = ["$mdDialog"];

        function instructionDialogController($mdDialog) {
            var dvm = this;

            dvm.newInstruction = {
                photo: '',
                text: ''
            };

            dvm.closeDialog = function() {
                $mdDialog.cancel();
            };

            dvm.submit = function() {
                $mdDialog.hide(dvm.newInstruction);
            };
        }
        instructionDialogController.$inject = ["$mdDialog"];

        function init() {
            $scope.setMenuBar({});
            //get the dish by id
            DishService.get($routeParams.dishId).success(function(data) {
                vm.dish = data;
            });

            DishService.getInstructions($routeParams.dishId).success(function(data) {
                vm.dish.instructions = data;
            });

            vm.difficulties = DishService.getDifficulties();
        }

        init();
    }]);

angular.module('spicyTaste')
    .controller('DishInstructionController', ["DishService", "$routeParams", function(DishService, $routeParams) {
        'use strict';
        var vm = this;

        function init() {
            DishService.getInstructions($routeParams.dishId).success(function(data) {
                vm.instructions = data;

                if (vm.instructions.length > 0) {
                    vm.currentIndex = 0;
                }
            });
        }

        vm.isWithinShowRange = function(index) {
            return index >= vm.currentIndex - 1 && index <= vm.currentIndex + 1;
        };

        vm.setNavClass = function(index) {
            if (index === vm.currentIndex - 1) {
                return 'pre';
            }

            if (index === vm.currentIndex) {
                return 'current';
            }

            if (index === vm.currentIndex + 1) {
                return 'next';
            }
        };

        vm.showNext = function() {
            vm.currentIndex += 1;
        };

        vm.showPre = function() {
            vm.currentIndex -= 1;
        };

        init();
    }]);

angular.module('spicyTaste')
    .controller('DishShowController', ["DishService", "CommentService", "$interval", "$timeout", "$routeParams", "$filter", "$rootScope", "$scope", function(DishService, CommentService, $interval, $timeout, $routeParams, $filter, $rootScope, $scope) {
        'use strict';

        var vm = this;
        var commentInterval;

        vm.getAllComments = function() {
            CommentService.getByDish($routeParams.dishId, null).success(function(data) {
                vm.showAllComments = true;
                vm.currentComment = null;
                vm.allComments = data;
            });
        };

        vm.createComment = function($event) {
            if (!$rootScope.currentUser) {
                $scope.showLoginDialog($event, true, 'Login/SignUp first to leave a comment').then(function(user) {
                    $rootScope.currentUser = user;
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
                vm.dish.difficultyText = 'Difficulty: ' + DishService.getDifficulties()[vm.dish.difficulty - 1];

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

                $timeout(function() {
                    vm.showDifficulty = false;
                }, 3000);

                if ($rootScope.currentUser) {
                    var found = $filter('filter')($rootScope.currentUser.favouriteDishes, {
                        _id: vm.dish._id
                    }, true);

                    if (found.length) {
                        vm.dish.isCollected = true;
                    }
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
    }]);

angular.module('spicyTaste')
    .controller('ThemeAdminEditController', ["ThemeService", "$routeParams", "$timeout", "DishService", function(ThemeService, $routeParams, $timeout, DishService) {
        'use strict';

        var vm = this;

        vm.update = function() {
            ThemeService.update(vm.theme._id, vm.theme).success(function(data) {
                if (data.success) {
                    vm.updateSuccess = true;

                    $timeout(function() {
                        vm.updateSuccess = false;
                    }, 800);
                }

            });
        };

        vm.addDish = function(dish) {
            vm.theme.components.push({
                title: '',
                displayOrder: vm.theme.components.length + 1,
                dish: dish
            });
        };

        vm.removeComponent = function(index) {
            vm.theme.components.splice(index, 1);
        };

        vm.getDisplayOrders = function() {
            var orders = [];
            for (var i = 0; i < vm.theme.components.length; i++) {
                orders.push(i + 1);
            }

            return orders;
        };

        function init() {
            vm.theme = {};
            vm.dishes = [];

            ThemeService.get($routeParams.id).success(function(data) {
                vm.theme = data;
            });

            DishService.all().success(function(data) {
                vm.dishes = data;
            });
        }

        init();

    }]);

angular.module('spicyTaste')
    .controller('ThemeAdminListController', ["ThemeService", "$location", function(ThemeService, $location) {
        'use strict';

        var vm = this;

        vm.create = function() {
            ThemeService.create({
                name: 'new theme'
            }).success(function(data) {
                $location.path('/admin/themes/' + data.theme._id);
            });
        };

        function init() {
            vm.themes = {};

            ThemeService.getAll().success(function(data) {
                vm.themes = data;
            });
        }

        init();
    }]);

angular.module('spicyTaste')
    .controller('ThemeShowController', ["ThemeService", "$routeParams", function(ThemeService, $routeParams) {
        'use strict';
        var vm = this;

        function init() {
            vm.theme = {};
            ThemeService.searchBy('name=' + $routeParams.name).success(function(data) {
                if (data && data.length > 0) {
                    vm.theme = data[0];
                    vm.theme.slogans = vm.theme.slogan.split('|');
                }
            });

            ThemeService.getOthers($routeParams.name, 3).then(function(data) {
                vm.otherThemes = data;
            });
        }

        init();
    }]);
