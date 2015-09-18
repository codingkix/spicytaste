angular.module('spicyTaste')
    .directive('scrollTo', function() {
        return {
            restrict: 'A',
            link: function(scope, $element, attrs) {
                var $target = $(attrs.scrollTo);
                $element.on('click', function() {
                    console.log('offset', $target.offset().top);
                    $('html, body').animate({
                        scrollTop: $target.offset().top
                    }, 600);
                });
            }
        };
    });
