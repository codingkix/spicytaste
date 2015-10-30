angular.module('spicyTaste')
    .directive('showTime', function($window, UtilityService) {
        'use strict';
        return {
            restrict: 'A',
            scope: true,
            link: function(scope, $element, $attrs) {
                var showTime = scope.$eval($attrs.showTime);
                var offset = 0;
                if (!angular.isUndefined(showTime)) {
                    offset = showTime.offset;
                }

                var onScrollDebounced = UtilityService.debounce(function() {
                    if ($element.hasClass('viewed')) {
                        return;
                    }

                    var docTop = angular.element($window).scrollTop();
                    var docBottom = docTop + angular.element($window).height();

                    var elemTop = $element.offset().top;
                    var elemBottom = elemTop + $element.height();

                    if (offset !== 0) {
                        if (docTop - elemTop >= 0) {
                            // scrolling up from bottom
                            elemTop += offset;
                        } else {
                            // scrolling down from top
                            elemBottom -= offset;
                        }
                    }

                    if (elemBottom <= docBottom && elemTop >= docTop) {
                        $element.removeClass('notViewed').addClass('viewed');
                    }
                }, 200, true);

                angular.element($window).on('scroll', onScrollDebounced);

                scope.$on('$destroy', onScrollDebounced);
            }
        };
    });
