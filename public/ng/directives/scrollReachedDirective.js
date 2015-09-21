angular.module('spicyTaste')
    .directive('scrollReached', function($window) {
        'use strict';
        return {
            restrict: 'A',
            scope: true,
            link: function(scope, $element, attrs) {
                var offset = $element.offset().top - 64;
                angular.element($window).on('scroll', function() {
                    if (this.pageYOffset >= offset) {
                        scope.setScrollReached(true);
                    } else {
                        scope.setScrollReached(false);
                    }
                    scope.$apply();
                });
            }
        };
    });
