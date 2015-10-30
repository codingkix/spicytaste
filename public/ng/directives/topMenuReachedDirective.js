angular.module('spicyTaste')
    .directive('topMenuReached', function($window, UtilityService) {
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
    });
