angular.module('spicyTaste')
    .directive('contenteditable', function() {
        'use strict';
        return {
            require: 'ngModel',
            restrict: 'A',
            link: function(scope, element, attributs, ngModel) {
                ngModel.$render = function() {
                    element.html(ngModel.$viewValue || '');
                };

                element.bind('blur', function() {
                    scope.$apply(function() {
                        ngModel.$setViewValue(element.html());
                    });
                });
            }
        };
    });
