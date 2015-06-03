angular.module('spicyTaste')
    .config(function($mdThemingProvider, $mdIconProvider) {

        var primaryOrange = $mdThemingProvider.extendPalette('deep-orange', {
            '500': 'f27242'
        });

        var primaryBlue = $mdThemingProvider.extendPalette('blue', {
            '500': '6984b4',
            '600': '6984b4'
        });

        $mdThemingProvider.definePalette('primaryOrange', primaryOrange);
        $mdThemingProvider.definePalette('primaryBlue', primaryBlue);

        $mdThemingProvider.theme('default')
            .primaryPalette('primaryOrange')
            .accentPalette('light-green');

        $mdThemingProvider.theme('blue')
            .primaryPalette('primaryBlue');

        $mdIconProvider.icon('menu', 'assets/svg/ic_menu_24px.svg')
            .icon('share', 'assets/svg/ic_share_24px.svg')
            .icon('login', 'assets/svg/ic_account_circle_24px.svg')
            .icon('recipes', 'assets/svg/ic_event_note_48px.svg')
            .icon('restaurants', 'assets/svg/ic_restaurant_menu_48px.svg')
            .icon('ingredients', 'assets/svg/ic_receipt_48px.svg')
            .icon('arrow', 'assets/svg/ic_arrow_drop_up_48px.svg')
            .icon('more', 'assets/svg/ic_more_24px.svg')
            .icon('time1', 'assets/svg/ic_av_timer_24px.svg')
            .icon('time2', 'assets/svg/ic_access_time_24px.svg')
            .icon('difficulty', 'assets/svg/ic_track_changes_24px.svg')
            .icon('exit', 'assets/svg/ic_exit_to_app_48px.svg');

    });
