angular.module('spicyTaste', ['ngRoute', 'angular-md5', 'ngMaterial', 'ngAnimate', 'ngMessages']);

angular.module('spicyTaste')
.constant('CONFIG', {"FacebookAppId":"1563567387253468","AWS_ACCESS_KEY":"AKIAISDEEB5CEMMQTZPA","AWS_SECRECT_KEY":"S197rM/ivjnDW51R8kJJC6jP+Yi8hCZDuG1HHBmB","LATEST_COUNT":10,"LOCAL_STORAGE_KEY":"spicyTasteUser"});

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
            .accentPalette('deep-orange');

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
            .icon('edit', 'svg/ic_edit_48px.svg')
            .icon('email', 'svg/ic_email_48px.svg')
            .icon('lock', 'svg/ic_lock_outline_48px.svg')
            .icon('user', 'svg/ic_person_outline_48px.svg')
            .icon('go', 'svg/ic_play_circle_fill_48px.svg')
            .icon('upload', 'svg/ic_cloud_upload_48px.svg')
            .icon('send', 'svg/ic_send_48px.svg')
            .icon('upload-error', 'svg/ic_cloud_off_48px.svg')
            .icon('tips', 'svg/ic_note_add_48px.svg');
    }]);

angular.module('spicyTaste')
    .run(["$rootScope", "$location", "$window", "UserService", "CONFIG", function($rootScope, $location, $window, UserService, CONFIG) {
        'use strict';

        $window.fbAsyncInit = function() {
            FB.init({
                appId: CONFIG.FacebookAppId,
                cookie: true, // enable cookies to allow the server to access the session
                xfbml: true, // parse social plugins on this page
                status: true,
                version: 'v2.5'
            });

            UserService.watchFBAuthChange();
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

        window.pAsyncInit = function() {
            PDK.init({
                appId: '4803431288025393530',
                cookie: true
            });
        };

        (function(d, s, id) {
            var js, pjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {
                return;
            }
            js = d.createElement(s);
            js.id = id;
            js.src = '//assets.pinterest.com/sdk/sdk.js';
            pjs.parentNode.insertBefore(js, pjs);
        }(document, 'script', 'pinterest-jssdk'));

        //Check Authorization
        $rootScope.$on('$routeChangeStart', function(event, next) {
            if (next && next.access) {
                UserService.authorize(next.access.requirePermissions).then(function(result) {
                    if (!result) {
                        if (next.access.requirePermissions.indexOf('ADMIN') >= 0) {
                            $location.path('not-authorize').replace();
                        } else {
                            $location.path('/share').replace();
                        }
                    }
                }, function() {
                    if (next.access.requirePermissions.indexOf('ADMIN') >= 0) {
                        $location.path('not-authorize').replace();
                    } else {
                        $location.path('/share').replace();
                    }
                });
            }
        });

        $rootScope.$watch('currentUser', function() {
            $rootScope.$broadcast('logined');
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
            .when('/share', {
                templateUrl: 'ng/views/pages/dish/share.html',
                controller: 'DishShareController',
                controllerAs: 'share'
            })
            .when('/themes', {
                templateUrl: 'ng/views/pages/theme/all.html',
                controller: 'ThemeAllController',
                controllerAs: 'themeAll'
            })
            .when('/themes/:name', {
                templateUrl: '/ng/views/pages/theme/show.html',
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
            //edit a dish page
            .when('/me/dishes/:dishId', {
                templateUrl: 'ng/views/pages/dish/edit.html',
                controller: 'DishEditController',
                controllerAs: 'dishManage',
                access: {
                    requirePermissions: ['READER']
                }
            })
            //edit dish instructions page
            .when('/me/dishes/:dishId/instructions', {
                templateUrl: 'ng/views/pages/dish/edit-instructions.html',
                controller: 'DishEditInstructionController',
                controllerAs: 'instructionEdit',
                access: {
                    requirePermissions: ['READER']
                }
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
                controllerAs: 'profile',
                access: {
                    requirePermissions: ['READER']
                }
            })
            .when('/not-authorize', {
                templateUrl: 'ng/views/pages/not-authorize.html'
            })
            .when('/admin', {
                templateUrl: '/ng/views/pages/admin/index.html',
                access: {
                    requirePermissions: ['ADMIN']
                }
            })
            //list admin themes page
            .when('/admin/themes', {
                templateUrl: '/ng/views/pages/admin/theme/list.html',
                controller: 'ThemeAdminListController',
                controllerAs: 'themeList',
                access: {
                    requirePermissions: ['ADMIN']
                }
            })
            //edit a theme page
            .when('/admin/themes/:id', {
                templateUrl: 'ng/views/pages/admin/theme/edit.html',
                controller: 'ThemeAdminEditController',
                controllerAs: 'themeEdit',
                access: {
                    requirePermissions: ['AdMIN']
                }
            })
            //list admin dish page
            .when('/admin/dishes', {
                templateUrl: 'ng/views/pages/admin/dish/list.html',
                controller: 'DishAdminListController',
                controllerAs: 'dishList',
                access: {
                    requirePermissions: ['ADMIN']
                }
            });
    }]);

angular.module('spicyTaste')
    .controller('HomeController', ["$scope", "$mdMedia", "DishService", "CONFIG", function($scope, $mdMedia, DishService, CONFIG) {
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

    }]);

angular.module('spicyTaste')
    .controller('LoginController', ["$rootScope", "$scope", "$mdDialog", "UserService", "md5", function($rootScope, $scope, $mdDialog, UserService, md5) {
        'use strict';

        var vm = this;

        vm.fbLogin = function() {
            UserService.fbLogin();
            $mdDialog.hide();
        };

        vm.login = function() {
            UserService.login(vm.email, vm.password).then(function() {
                $mdDialog.hide();
            }, function() {
                vm.loginFailed = true;
            });
        };

        vm.signUp = function() {
            var newUser = {
                userName: vm.userName,
                email: vm.email,
                password: vm.password,
                photoUrl: 'http://www.gravatar.com/avatar/' + md5.createHash(vm.email)
            };

            UserService.create(newUser).then(function() {
                $mdDialog.hide();
            }, function() {
                vm.loginFailed = true;
            });

        };

        function init() {
            vm.title = vm.dialogTitle;
            vm.email = '';
            vm.password = '';
            vm.userName = '';
            vm.loginFailed = false;
        }

        init();
    }]);

angular.module('spicyTaste')
    .controller('MainController', ["$rootScope", "$scope", "$location", "$mdDialog", "$http", "SessionService", "UserService", "CONFIG", function($rootScope, $scope, $location, $mdDialog, $http, SessionService, UserService, CONFIG) {
        'use strict';
        var vm = this;

        vm.toggleMobileMenu = function() {
            vm.showMobileMenu = !vm.showMobileMenu;
        };

        $scope.setMenuBar = function(menuBar) {
            vm.menuBar = {};
            angular.extend(vm.menuBar, vm.defaultMenu, menuBar);
        };

        $scope.showLoginDialog = function(ev, postLogin, title) {
            var promise = $mdDialog.show({
                clickOutsideToClose: true,
                templateUrl: 'ng/views/dialogs/login.html',
                targetEvent: ev,
                controller: 'LoginController',
                controllerAs: 'login',
                locals: {
                    dialogTitle: title
                },
                bindToController: true
            });
            if (postLogin) {
                return promise;
            }
        };

        function init() {
            vm.showMobileMenu = false;
            vm.scrollTargetReached = false;
            vm.defaultMenu = {
                primaryTheme: false,
                hidden: false,
                text: 'SPICY TASTE'
            };
            vm.menuBar = vm.defaultMenu;

            var loginedToken = SessionService.getLocal(CONFIG.LOCAL_STORAGE_KEY);
            if (loginedToken) {
                console.log('token', loginedToken);
                $http.defaults.headers.common['X-Auth'] = loginedToken;
                UserService.getCurrentUser().success(function(user) {
                    $rootScope.currentUser = user;
                });
            }
        }

        init();
    }]);

angular.module('spicyTaste')
    .controller('ProfileController', ["UtilityService", "$location", "$scope", "$rootScope", "$timeout", "UserService", "DishService", function(UtilityService, $location, $scope, $rootScope, $timeout, UserService, DishService) {
        'use strict';

        var vm = this;

        vm.logout = function() {
            UserService.logout().then(function() {
                $location.path('/');
            });
        };

        vm.getRecipts = function() {
            if (vm.reciptsCount === 0) {
                return;
            }

            $scope.showSpinner = true;
            DishService.searchByAuthor($rootScope.currentUser._id).success(function(data) {
                vm.allRecipts = data;
            });
        };

        $scope.$on('onRepeatLast', function() {
            $timeout(function() {
                $scope.showSpinner = false;
            }, 400);
        });

        $scope.$on('uploaded', function(event, newPhoto) {
            UserService.updateInfo(vm.user._id, 'photoUrl', newPhoto).success(function() {
                $rootScope.currentUser.photoUrl = newPhoto;
            }).error(function() {
                UtilityService.showStatusToast(false, 'Error, try upload the photo again.');
            });
        });

        function init() {
            $scope.setMenuBar({
                primaryTheme: true
            });

            UserService.getProfile().success(function(data) {
                vm.user = data.user;
                for (var i = 0; i < vm.user.favouriteDishes.length; i++) {
                    vm.user.favouriteDishes[i].difficultyText = DishService.getDifficultyText(vm.user.favouriteDishes[i].difficulty);
                }
                vm.reciptsCount = data.reciptsCount;
            });
        }

        init();
    }]);

angular.module('spicyTaste')
    .directive('contenteditable', function() {
        'use strict';
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
    .directive('imageUpload', ["UtilityService", function(UtilityService) {
        'use strict';
        return {
            restrict: 'E',
            scope: {
                image: '='
            },
            replace: true,
            transclude: false,
            templateUrl: 'ng/views/templates/imageUpload.html',
            controller: ["$scope", function($scope) {
                $scope.uploadStatus = {
                    progress: 0,
                    done: false,
                    error: false,
                    imageUrl: ''
                };

                $scope.changeUploadStatus = function(uploadStatus) {
                    angular.extend($scope.uploadStatus, uploadStatus);

                    if (uploadStatus.imageUrl && uploadStatus.imageUrl.trim() !== '') {
                        $scope.image = uploadStatus.imageUrl;
                        $scope.$emit('uploaded', uploadStatus.imageUrl);
                    }

                    $scope.$apply();
                };
            }],
            link: function($scope, $elements) {

                var fileBtn = $elements.find('input.file');

                fileBtn.on('change', function(event) {
                    $scope.changeUploadStatus({
                        progress: 0,
                        error: false,
                        done: false
                    });
                    var files = event.target.files;
                    var file = files[0];
                    UtilityService.awsUpload(file, null, $scope.changeUploadStatus);
                });

            }
        };
    }]);

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
            scope: {
                recipt: '='
            },
            link: function($scope, $element) {
                $scope.$watch('recipt', function(newVal) {
                    if (newVal.name) {
                        var recipt = newVal;
                        if (recipt.blog) {
                            recipt.description = recipt.blog.length > 200 ? recipt.blog.substring(0, 200) + '...' : recipt.blog;
                        } else {
                            recipt.description = 'Come to try this delicious';
                        }
                        $element.find('#btnFB').click(function() {
                            var shareObj = {
                                picture: recipt.imageUrl,
                                caption: recipt.name,
                                description: recipt.description,
                                redirect_uri: $location.absUrl()
                            };
                            if ($location.absUrl().indexOf('localhost') < 0) {
                                shareObj.link = $location.absUrl();
                            }
                            SocialService.fbShare(shareObj);
                        });

                        $element.find('#btnPinterest').click(function() {
                            PDK.pin(recipt.imageUrl, recipt.name, $location.absUrl(), function() {
                                //do something like badges
                            });
                        });
                    }
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

        //update dish photos
        dishFactory.submitPhotos = function(dishId, photos) {
            return $http.put(baseUrl + dishId + '/photos', photos);
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
        dishFactory.getDishWithInstructions = function(dishId) {
            return $http.get(baseUrl + dishId + '/instructions');
        };

        //add a instruction
        dishFactory.addInstruction = function(dishId, instruction) {
            return $http.post(baseUrl + dishId + '/instructions', instruction);
        };

        //update a instruction
        dishFactory.updateInstruction = function(instruction) {
            return $http.put('/api/instructions/' + instruction._id, instruction);
        };

        //remove an instruction
        dishFactory.removeInstruction = function(dishId, instructionId) {
            return $http.delete(baseUrl + dishId + '/instructions/' + instructionId);
        };

        //get difficulty
        dishFactory.getDifficulties = function() {
            return ['初学', '容易', '一般', '较难', '专业'];
        };

        //get difficulty text
        dishFactory.getDifficultyText = function(level) {
            return dishFactory.getDifficulties()[level - 1];
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
        'use strict';
        var socialFactory = {};

        socialFactory.fbShare = function(shareObj) {
            FB.ui({
                method: 'feed',
                link: shareObj.link,
                picture: shareObj.picture,
                caption: shareObj.caption,
                description: shareObj.description,
                redirect_uri: shareObj.redirect_uri
            }, function() {});
        };

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
    .factory('UserService', ["$http", "$rootScope", "$q", "$window", "SessionService", "CONFIG", function($http, $rootScope, $q, $window, SessionService, CONFIG) {
        'use strict';

        var userFactory = {};
        var baseUrl = '/api/users/';

        function afterAuth(result) {
            $http.defaults.headers.common['X-Auth'] = result.token;
            SessionService.setLocal(CONFIG.LOCAL_STORAGE_KEY, result.token);
            $rootScope.currentUser = result.user;
            return true;
        }

        function authFB(fbUser) {

            return $http.post('/api/auth/facebook', fbUser).then(function(response) {
                return afterAuth(response.data);
            }, function() {});
        }

        //fb login
        userFactory.fbLogin = function() {
            FB.login(function(response) {
                if (response.status === 'connected') {

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

        userFactory.watchFBAuthChange = function() {
            FB.Event.subscribe('auth.authResponseChange', function(res) {
                if (res.status === 'connected') {
                    userFactory.getFBUserInfo().then(function(fbUser) {
                        if (!$rootScope.currentUser) {
                            authFB(fbUser);
                        } else if (!$rootScope.currentUser.facebook) {
                            userFactory.updateInfo($rootScope.currentUser._id, 'facebook', fbUser.facebook);
                        }
                    });
                } else {}

            });
        };

        userFactory.getFBUserInfo = function() {
            var deffered = $q.defer();

            FB.api('/me', {
                fields: 'id, name, email'
            }, function(response) {
                if (!response || response.error) {
                    deffered.reject('FB api/me error');
                }

                var fbUser = {
                    userName: response.name,
                    email: response.email,
                    photoUrl: 'http://graph.facebook.com/' + response.id + '/picture?type=large',
                    facebook: {
                        id: response.id,
                        email: response.email
                    }
                };
                deffered.resolve(fbUser);

            });

            return deffered.promise;
        };

        //login user
        userFactory.login = function(email, password) {

            return $http.post('/api/auth', {
                email: email,
                password: password
            }).then(function(response) {
                return afterAuth(response.data);
            }, function() {
                return false;
            });
        };

        //logout user
        userFactory.logout = function() {
            var deffered = $q.defer();
            delete $http.defaults.headers.common['X-Auth'];
            $window.localStorage.removeItem(CONFIG.LOCAL_STORAGE_KEY);

            FB.getLoginStatus(function(response) {
                if (response.status === 'connected') {
                    FB.logout(function() {
                        deffered.resolve();
                    });
                } else {
                    deffered.resolve();
                }
            });

            $rootScope.currentUser = null;
            return deffered.promise;
        };

        //search user by field
        userFactory.searchBy = function(query) {
            return $http.get('/api/users?' + query).then(function(response) {
                return response.data;
            });
        };

        userFactory.getCurrentUser = function() {
            return $http.get('/api/me');
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
            return $http.put(baseUrl + user.userId, user);
        };

        userFactory.updateInfo = function(userId, field, newValue) {
            return $http.put(baseUrl + userId + '/field', {
                field: field,
                newValue: newValue
            });
        };

        //collect dish as favourite
        userFactory.collect = function(dishId) {
            return $http.put(baseUrl + $rootScope.currentUser._id + '/dishes/' + dishId);
        };

        //authorize user
        userFactory.authorize = function(requirePermissions) {
            return userFactory.getCurrentUser().success(function(user) {
                if (user && user.role === 'ADMIN') {
                    return true;
                }
                if (user && requirePermissions.indexOf(user.role) >= 0) {
                    return true;
                }
                return false;
            }).error(function(err) {
                console.log('error', err);
                return false;
            });
        };

        return userFactory;
    }]);

angular.module('spicyTaste')
    .factory('UtilityService', ["$timeout", "$mdToast", "$document", "CONFIG", function($timeout, $mdToast, $document, CONFIG) {
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

        utilityFactory.showStatusToast = function(isSuccess, message, parent) {
            $mdToast.show({
                controller: ["$scope", function($scope) {
                    $scope.content = message;
                    $scope.isSuccess = isSuccess;
                }],
                templateUrl: 'ng/views/templates/toast.html',
                hideDelay: 2000,
                position: 'top right',
                parent: $document[0].querySelector(parent)
            });
        };

        utilityFactory.awsUpload = function(file, folder, changeUploadStatus) {

            AWS.config.update({
                accessKeyId: CONFIG.AWS_ACCESS_KEY,
                secretAccessKey: CONFIG.AWS_SECRECT_KEY
            });

            AWS.config.region = 'us-west-2';

            var bucketName = folder === null ? 'spicytaste-tmp-photos' : 'spicytaste-photos/' + folder;
            var bucket = new AWS.S3({
                params: {
                    Bucket: bucketName
                }
            });

            var params = {
                Key: file.name,
                ContentType: file.type,
                Body: file,
                ServerSideEncryption: 'AES256'
            };

            var request = bucket.putObject(params);
            setTimeout(request.abort.bind(request), 5000); //abort the request after 5 sec

            if (changeUploadStatus) {
                request.on('httpError', function(err, response) {
                    console.log('upload err', err);

                    changeUploadStatus({
                        error: true
                    });

                    $timeout(function() {
                        changeUploadStatus({
                            error: false
                        });
                    }, 300);

                }).on('httpDone', function(response) {
                    changeUploadStatus({
                        imageUrl: 'https://s3-us-west-2.amazonaws.com/' + bucketName + '/' + file.name
                    });

                    $timeout(function() {
                        changeUploadStatus({
                            done: true,
                            progress: 0
                        });
                    }, 300);

                }).on('httpUploadProgress', function(progress, response) {
                    changeUploadStatus({
                        progress: Math.round(progress.loaded / progress.total * 100)
                    });

                }).on('error', function(response) {
                    console.log('aws putObject error', response);
                }).send();
            } else {
                return request;
            }
        };
        return utilityFactory;
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
    .controller('ThemeAllController', ["ThemeService", function(ThemeService) {
        'use strict';
        var vm = this;

        function init() {
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

angular.module('spicyTaste')
    //controller applied to dish list page
    .controller('DishAdminListController', ["DishService", function(DishService) {
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

    }]);

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
                if (data[i].blog && data[i].blog.length > 200) {
                    data[i].blog = data[i].blog.substring(0, Math.floor(Math.random() * 100) + 100) + ' ...';
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
    .controller('DishEditController', ["UtilityService", "$scope", "$mdDialog", "$mdToast", "$routeParams", "DishService", "$location", "$timeout", function(UtilityService, $scope, $mdDialog, $mdToast, $routeParams, DishService, $location, $timeout) {
        'use strict';
        var vm = this;

        vm.submitNext = function(formDirty) {

            //form.$dirty can't track md-chips
            if (!formDirty) {
                formDirty = vm.dish.tags.length !== vm.initialTagCount || vm.dish.ingredients.length !== vm.initialIngredientCount;
            }

            if (formDirty) {
                DishService.update($routeParams.dishId, vm.dish).success(function() {
                    UtilityService.showStatusToast(true, 'Recipe Info Is Updated.');
                    changeWizardStatus();
                }).error(function() {
                    UtilityService.showStatusToast(false, 'Error, please try again.');
                });
            } else {
                changeWizardStatus();
            }
        };

        vm.submitPhotos = function() {
            DishService.submitPhotos($routeParams.dishId, vm.dish.photos).success(function(result) {
                if (result.success) {
                    if (vm.wizardMode) {
                        vm.wizardMode = false;
                    }
                    vm.showBottomSheet = false;
                    UtilityService.showStatusToast(true, 'Recipe Photos Are Saved.');
                } else {
                    UtilityService.showStatusToast(false, 'Error, please try again.');
                }
            });
        };

        vm.removePhoto = function(index) {
            vm.dish.photos[index] = '';
        };

        function changeWizardStatus() {
            if (vm.wizardMode) {
                if (vm.showRightPanel) {
                    vm.showBottomSheet = true;
                    vm.showHeroButtons = true;
                } else if (vm.showLeftPanel) {
                    vm.showRightPanel = true;
                }
            }
        }

        function init() {
            $scope.setMenuBar({});

            vm.showBottomSheet = false;

            //prevent error logs by md-chips
            vm.dish = {
                tags: [],
                ingredients: []
            };

            if ($location.search().wizardMode === 'true') {
                vm.wizardMode = true;
            }

            $timeout(function() {
                vm.showLeftPanel = true;
            }, 500);

            //get the dish by id
            DishService.get($routeParams.dishId).success(function(data) {
                vm.dish = data;

                if (!vm.dish.photos) {
                    vm.dish.photos = [];
                }
                var photoCount = vm.dish.photos.length;
                for (var i = photoCount; i < 4; i++) {
                    vm.dish.photos.push('');
                }
            });
            vm.difficulties = DishService.getDifficulties();
            vm.initialTagCount = vm.dish.tags.length;
            vm.initialIngredientCount = vm.dish.ingredients.length;
        }

        init();
    }]);

angular.module('spicyTaste')
    .controller('DishEditInstructionController', ["$scope", "DishService", "$routeParams", "UtilityService", function($scope, DishService, $routeParams, UtilityService) {
        'use strict';

        var vm = this;

        function init() {
            $scope.setMenuBar({
                primaryTheme: true
            });

            vm.newInstruction = {
                text: '',
                photo: ''
            };

            DishService.getDishWithInstructions($routeParams.dishId).success(function(data) {
                vm.dish = data;
                for (var i = 0; i < vm.dish.instructions.length; i++) {
                    vm.dish.instructions[i].showTips = angular.isString(vm.dish.instructions[i].tips) && vm.dish.instructions[i].tips !== '';
                }
            });
        }

        vm.save = function(index) {
            var item = vm.dish.instructions[index];
            item.showTips = item.tips !== '';
            if (item._id) {
                DishService.updateInstruction(item).success(function() {
                    UtilityService.showStatusToast(true, 'Instruction Info Is Updated.', 'md-tabs');
                }).error(function() {
                    UtilityService.showStatusToast(false, 'Error, please try again.', 'md-tabs');
                });
            } else {
                DishService.addInstruction($routeParams.dishId, item).success(function(data) {
                    vm.dish.instructions[index]._id = data._id;
                    UtilityService.showStatusToast(true, 'Instruction Is Saved.', 'md-tabs');
                }).error(function() {
                    UtilityService.showStatusToast(false, 'Error, please try again.', 'md-tabs');
                });
            }

        };

        vm.remove = function(index) {
            var item = vm.dish.instructions[index];
            if (item._id) {
                DishService.removeInstruction($routeParams.dishId, vm.dish.instructions[index]._id).success(function() {
                    vm.dish.instructions.splice(index, 1);
                }).error(function() {
                    UtilityService.showStatusToast(false, 'Error, please try again.', 'md-tabs');
                });
            } else {
                vm.dish.instructions.splice(index, 1);
            }

        };

        vm.add = function() {
            vm.dish.instructions.push({});
        };

        init();
    }]);

angular.module('spicyTaste')
    .controller('DishInstructionController', ["DishService", "$routeParams", function(DishService, $routeParams) {
        'use strict';
        var vm = this;

        function init() {
            DishService.getDishWithInstructions($routeParams.dishId).success(function(data) {
                vm.dish = data;

                if (vm.dish.instructions.length > 0) {
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
    .controller('DishShareController', ["$scope", "DishService", "$location", "$rootScope", "$timeout", function($scope, DishService, $location, $rootScope, $timeout) {
        'use strict';
        var vm = this;
        $scope.$on('logined', function() {
            vm.isLogined = true;
        });

        function init() {
            $scope.setMenuBar({
                primaryTheme: true
            });
            vm.newRecipt = {
                name: '',
                imageUrl: ''
            };
            vm.showLogin = true;
            vm.isLogined = !angular.isUndefined($rootScope.currentUser) && $rootScope.currentUser !== null;
        }

        vm.create = function() {
            vm.newRecipt.createdBy = $rootScope.currentUser._id;
            DishService.create(vm.newRecipt).success(function(data) {
                $location.path('/me/dishes/' + data.dish._id + '?wizardMode=true');
            });
        };

        vm.toggleLogin = function(show) {
            if (show) {
                vm.showSignUp = false;
                $timeout(function() {
                    vm.showLogin = true;
                }, 250);
            } else {
                vm.showLogin = false;
                $timeout(function() {
                    vm.showSignUp = true;
                }, 250);
            }
        };

        init();
    }]);

angular.module('spicyTaste')
    .controller('DishShowController', ["DishService", "UserService", "CommentService", "$interval", "$timeout", "$routeParams", "$filter", "$rootScope", "$scope", function(DishService, UserService, CommentService, $interval, $timeout, $routeParams, $filter, $rootScope, $scope) {
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
    }]);
