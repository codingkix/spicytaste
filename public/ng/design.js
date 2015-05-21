angular.module('spicyTaste')
    .config(function($mdThemingProvider, $mdIconProvider) {

        var primaryOrange = $mdThemingProvider.extendPalette('deep-orange', {
            '500': 'f27242'
        });

        $mdThemingProvider.definePalette('primaryOrange', primaryOrange);

        $mdThemingProvider.theme('default')
            .primaryPalette('primaryOrange')
            .accentPalette('light-green');

        $mdIconProvider.icon('menu', 'assets/svg/ic_menu_24px.svg')
            .icon('share', 'assets/svg/ic_share_24px.svg')
            .icon('login', 'assets/svg/ic_account_circle_24px.svg')
            .icon('recipes', 'assets/svg/ic_event_note_48px.svg')
            .icon('restaurants', 'assets/svg/ic_restaurant_menu_48px.svg');
    });
