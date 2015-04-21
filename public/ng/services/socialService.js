angular.module('spicyTaste')
    .factory('SocialService', function() {
        var socialFactory = {};

        socialFactory.fbShare = function(link) {
            FB.ui({
                method: 'share',
                href: link,
            }, function(response) {});
        }

        return socialFactory;
    });
