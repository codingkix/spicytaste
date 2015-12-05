angular.module('spicyTaste')
    .controller('LoginController', function($rootScope, $scope, $mdDialog, UserService, md5) {
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
    });
