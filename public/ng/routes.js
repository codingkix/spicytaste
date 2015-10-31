angular.module('spicyTaste')
    .config(function($locationProvider, $routeProvider) {
        'use strict';

        $locationProvider.html5Mode(true);

        $routeProvider
        //home page
            .when('/', {
                templateUrl: 'ng/views/pages/home.html',
                controller: 'HomeController',
                controllerAs: 'home'
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
    });
