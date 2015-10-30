angular.module('spicyTaste')
    .directive('originalSrc', function() {
        'use strict';

        return {
            restrict: 'A',
            scope: {
                originalSrc: '@'
            },
            link: function(scope, element, attrs) {
                element.on('load', function() {
                    element.attr('src', scope.originalSrc);
                    element.css('background', 'none');
                });
            }
        };
    });
