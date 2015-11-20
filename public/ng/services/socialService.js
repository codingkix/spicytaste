angular.module('spicyTaste')
    .factory('SocialService', function() {
        'use strict';
        var socialFactory = {};

        socialFactory.fbShare = function(shareObj) {
            FB.ui({
                method: 'feed',
                link: shareObj.link,
                picture: shareObj.picture,
                caption: shareObj.caption,
                description: shareObj.description,
                redirect_uri: shareObj.redirect_uri
            }, function() {});
        };

        return socialFactory;
    });
