angular.module('spicyTaste')
    .directive('scrollTo', function() {
        return {
            restrict: 'A',
            link: function(scope, $element, attrs) {
                var $target = $(attrs.scrollTo);
                $element.on('click', function() {
                    $('html, body').animate({
                        scrollTop: $target.offset().top
                    }, 600);
                });
            }
        };
    });
