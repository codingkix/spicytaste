angular.module('spicyTaste')
    .run(function($rootScope, $location, $window, UserService, CONFIG) {
        'use strict';

        $window.fbAsyncInit = function() {
            FB.init({
                appId: CONFIG.FacebookAppId,
                cookie: true, // enable cookies to allow the server to access the session
                xfbml: true, // parse social plugins on this page
                status: true,
                version: 'v2.5'
            });

            UserService.watchFBAuthChange();
        };

        // Load the SDK asynchronously
        (function(d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {
                return;
            }
            js = d.createElement(s);
            js.id = id;
            js.src = '//connect.facebook.net/en_US/sdk.js';
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));

        window.pAsyncInit = function() {
            PDK.init({
                appId: '4803431288025393530',
                cookie: true
            });
        };

        (function(d, s, id) {
            var js, pjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {
                return;
            }
            js = d.createElement(s);
            js.id = id;
            js.src = '//assets.pinterest.com/sdk/sdk.js';
            pjs.parentNode.insertBefore(js, pjs);
        }(document, 'script', 'pinterest-jssdk'));

        //Check Authorization
        $rootScope.$on('$routeChangeStart', function(event, next) {
            if (next && next.access) {
                UserService.authorize(next.access.requirePermissions).then(function(result) {
                    if (!result) {
                        if (next.access.requirePermissions.indexOf('ADMIN') >= 0) {
                            $location.path('not-authorize').replace();
                        } else {
                            $location.path('/share').replace();
                        }
                    }
                }, function() {
                    if (next.access.requirePermissions.indexOf('ADMIN') >= 0) {
                        $location.path('not-authorize').replace();
                    } else {
                        $location.path('/share').replace();
                    }
                });
            }
        });

        $rootScope.$watch('currentUser', function() {
            $rootScope.$broadcast('logined');
        });
    });
