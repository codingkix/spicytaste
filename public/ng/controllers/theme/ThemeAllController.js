angular.module('spicyTaste')
    .controller('ThemeAllController', function(ThemeService) {
        'use strict';
        var vm = this;

        function init() {
            ThemeService.getAll().success(function(data) {
                vm.themes = data;
            });
        }

        init();
    });
