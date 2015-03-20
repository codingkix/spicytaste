angular.module('spicyTaste')
    .config(function($locationProvider, $routeProvider) {
        $locationProvider.html5Mode(true);

        $routeProvider
        //home page
            .when('/', {
                templateUrl: 'ng/views/pages/home.html',
                controller: 'HomeController',
                controllerAs: 'home'
            })
            //show all dishes page
            .when('/dishes', {
                templateUrl: 'ng/views/pages/dish/list.html',
                controller: 'DishListController',
                controllerAs: 'dishList'
            })
            //create a new dish page
            .when('/dishes/create', {
                templateUrl: 'ng/views/pages/dish/single.html',
                controller: 'DishCreateController',
                controllerAs: 'dishManage'
            })
            //edit a dish page
            .when('/dishes/:dish_id', {
                templateUrl: 'ng/views/pages/dish/single.html',
                controller: 'DishEditController',
                controllerAs: 'dishManage'
            })
            //login user
            .when('/login', {
                templateUrl: 'ng/views/pages/user/login.html',
                controller: 'LoginController',
                controllerAs: 'login'
            })
            // //signup user
            // .when('/signup', {
            //     templateUrl: 'ng/views/pages/user/signup.html',
            //     controller: "SignUpController",
            //     controllerAs: 'signup'
            // })


    });
