angular.module('spicyTaste')
    .controller('MainController', function($rootScope, $scope, $location, $mdDialog, $http, SessionService, UserService, CONFIG) {
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
            vm. = false;
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
    });
