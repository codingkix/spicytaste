angular.module('spicyTaste')
    .directive('socialShares', function(SocialService, $location) {
        'use strict';
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'ng/views/templates/socialShares.html',
            link: function($scope, $element, $attr) {
                $element.find('#btnFB').click(function() {
                    SocialService.fbShare($location.absUrl());
                });

                //TODO: other shares
            }
        };
    });
