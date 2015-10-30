angular.module('spicyTaste')
    .controller('ThemeShowController', function(ThemeService, $routeParams) {
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
    });
