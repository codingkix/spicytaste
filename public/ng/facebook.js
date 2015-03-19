angular.module('spicyTaste')
    .run(function($rootScope, $window, UserService, CONSTANTS) {
        $rootScope.user = null;

        $window.fbAsyncInit = function() {
            FB.init({
                appId: CONSTANTS.FB_APP_ID,
                cookie: true, // enable cookies to allow the server to access the session
                xfbml: true, // parse social plugins on this page
                version: 'v2.2' // use version 2.2
            });
        };

        // Load the SDK asynchronously
        (function(d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            js = d.createElement(s);
            js.id = id;
            js.src = "//connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
    });
