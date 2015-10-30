angular.module('spicyTaste')
    .directive('focus', function() {
        'use strict';

        return {
            restrict: 'A',
            scope: {
                trigger: '@focus'
            },
            link: {
                post: function($scope, $element) {
                    $scope.$watch('trigger', function(newVal) {
                        if (newVal === 'true') {
                            $element[0].focus();
                        }
                    });
                }
            }
        };
    });
