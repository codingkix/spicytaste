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
            .when('/inspire', {
                templateUrl: '/ng/views/pages/shows/dinner.html',
                controller: 'DinnerController',
                controllerAs: 'dinner'
            })
            //show all dishes page
            .when('/dishes', {
                templateUrl: 'ng/views/pages/dish/all.html',
                controller: 'DishListController',
                controllerAs: 'dishList'
            })
            //show dish detail page
            .when('/dishes/:dish_id', {
                templateUrl: 'ng/views/pages/dish/detail.html',
                controller: 'DishDetailController',
                controllerAs: 'dishDetail'
            })
            //list admin dish page
            .when('/admin/dishes', {
                templateUrl: 'ng/views/pages/admin/dish/list.html',
                controller: 'DishListController',
                controllerAs: 'dishList',
                access: {
                    requirePermissions: ['Admin']
                }
            })
            //edit a dish page
            .when('/admin/dishes/:dish_id', {
                templateUrl: 'ng/views/pages/admin/dish/single.html',
                controller: 'DishEditController',
                controllerAs: 'dishManage',
                access: {
                    requirePermissions: ['Admin']
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
                controllerAs: 'me'
            })
            .when('/not-authorize', {
                templateUrl: 'ng/views/pages/not-authorize.html'
            });
    });
