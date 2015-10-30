angular.module('spicyTaste')
    .controller('ThemeAdminListController', function(ThemeService, $location) {
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
    });
