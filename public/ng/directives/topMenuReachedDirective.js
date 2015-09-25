angular.module('spicyTaste')
    .directive('topMenuReached', function($window) {
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

                angular.element($window).on('scroll', function() {
                    if (this.pageYOffset >= offset) {
                        scope.setMenuBar(menuBar);
                    } else {
                        scope.setMenuBar(defaultMenuBar);
                    }
                    scope.$apply();
                });
            }
        };
    });
