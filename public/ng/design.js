angular.module('spicyTaste')
    .config(function($mdThemingProvider, $mdIconProvider) {
        'use strict';

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
            .accentPalette('deep-orange');

        $mdThemingProvider.theme('blue')
            .primaryPalette('primaryBlue');

        $mdIconProvider.icon('menu', 'svg/ic_menu_24px.svg')
            .icon('share', 'svg/ic_share_48px.svg')
            .icon('login', 'svg/ic_account_circle_24px.svg')
            .icon('recipes', 'svg/ic_event_note_48px.svg')
            .icon('restaurants', 'svg/ic_restaurant_menu_48px.svg')
            .icon('ingredients', 'svg/ic_receipt_48px.svg')
            .icon('arrow', 'svg/ic_arrow_drop_up_48px.svg')
            .icon('more', 'svg/ic_more_24px.svg')
            .icon('time1', 'svg/ic_av_timer_24px.svg')
            .icon('time2', 'svg/ic_access_time_24px.svg')
            .icon('exit', 'svg/ic_exit_to_app_48px.svg')
            .icon('photo', 'svg/ic_mms_24px.svg')
            .icon('check', 'svg/ic_check_circle_24px.svg')
            .icon('facebook', 'svg/facebook.svg')
            .icon('twitter', 'svg/twitter.svg')
            .icon('pinterest', 'svg/pinterest.svg')
            .icon('comments', 'svg/ic_chat_48px.svg')
            .icon('menu', 'svg/ic_menu_48px.svg')
            .icon('favorite', 'svg/ic_favorite_24px.svg')
            .icon('delete', 'svg/ic_delete_48px.svg')
            .icon('add', 'svg/ic_add_circle_outline_48px.svg')
            .icon('arrow-down', 'svg/ic_expand_more_48px.svg')
            .icon('play', 'svg/ic_play_circle_outline_48px.svg')
            .icon('search', 'svg/ic_search_48px.svg')
            .icon('pin', 'svg/ic_attach_file_48px.svg')
            .icon('clear', 'svg/ic_clear_all_48px.svg')
            .icon('next', 'svg/ic_chevron_right_48px.svg')
            .icon('pre', 'svg/ic_chevron_left_48px.svg')
            .icon('edit', 'svg/ic_edit_48px.svg')
            .icon('email', 'svg/ic_email_48px.svg')
            .icon('lock', 'svg/ic_lock_outline_48px.svg')
            .icon('user', 'svg/ic_person_outline_48px.svg')
            .icon('go', 'svg/ic_play_circle_fill_48px.svg')
            .icon('send', 'svg/ic_send_48px.svg');
    });
