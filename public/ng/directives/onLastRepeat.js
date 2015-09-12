angular.module('spicyTaste')
    .directive('onLastRepeat', function($timeout) {
        return function($scope, $element, $attrs) {
            if ($scope.$last) {
                $timeout(function() {
                    $scope.$emit('onRepeatLast', $element, $attrs);
                }, 0);
            }
        }
    });
