angular.module('spicyTaste')
    .directive('socialShares', function(SocialService, $location) {
        'use strict';
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'ng/views/templates/socialShares.html',
            scope: {
                recipt: '='
            },
            link: function($scope, $element) {
                $scope.$watch('recipt', function(newVal) {
                    if (newVal.name) {
                        var recipt = newVal;
                        if (recipt.blog) {
                            recipt.description = recipt.blog.length > 200 ? recipt.blog.substring(0, 200) + '...' : recipt.blog;
                        } else {
                            recipt.description = 'Come to try this delicious';
                        }
                        $element.find('#btnFB').click(function() {
                            var shareObj = {
                                picture: recipt.imageUrl,
                                caption: recipt.name,
                                description: recipt.description,
                                redirect_uri: $location.absUrl()
                            };
                            if ($location.absUrl().indexOf('localhost') < 0) {
                                shareObj.link = $location.absUrl();
                            }
                            SocialService.fbShare(shareObj);
                        });

                        $element.find('#btnPinterest').click(function() {
                            PDK.pin(recipt.imageUrl, recipt.name, $location.absUrl(), function() {
                                //do something like badges
                            });
                        });
                    }
                });

                //TODO: other shares
            }
        };
    });
