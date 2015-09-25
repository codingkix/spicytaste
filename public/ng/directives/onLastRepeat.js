angular.module('spicyTaste')
    .directive('onLastRepeat', function($timeout) {
        'use strict';
        return function($scope, $element, $attrs) {
            if ($scope.$last) {
                $timeout(function() {
                    $scope.$emit('onRepeatLast', $element, $attrs);
                }, 0);
            }
        };
    });
