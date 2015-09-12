angular.module('spicyTaste')
    .directive('flipbook', function() {
        return {
            transclude: false,
            restrict: 'E',
            replace: true,
            templateUrl: 'ng/views/templates/flipbook.html',
            scope: {
                dish: '='
            }
        }
    })
