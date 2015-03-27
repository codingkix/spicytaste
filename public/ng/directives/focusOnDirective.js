angular.module('spicyTaste')
    .directive('focusOn', function() {
        return {
            restrict: 'A',
            scope: {
                focusValue: "=focusOn"
            },
            link: function($scope, $element) {
                $scope.$watch('focusValue', function(currentValue, previousValue) {
                    if (currentValue && !previousValue) {
                        $element[0].focus();
                    }
                });
            }
        };
    });
