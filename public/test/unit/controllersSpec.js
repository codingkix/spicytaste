'use strict';

describe('Controllers Test', function() {
    beforeEach(module('spicyTaste'));

    describe('MainController', function() {
        var ctrl, scope;

        beforeEach(inject(function($controller, $rootScope) {
            scope = $rootScope.$new();
            ctrl = $controller('MainController', {
                $scope: scope
            });
        }));

        it('should create default menu object', function() {
            var menu = {
                primaryTheme: false,
                hidden: false,
                text: 'SPICY TASTE'
            };

            expect(ctrl.menuBar).toEqual(menu);
        });

        it('should set showMobileMenu to be false', function() {
            expect(ctrl.showMobileMenu).toBeFalsy();
        });

        it('should set scrollTargetReached to be false', function() {
            expect(ctrl.scrollTargetReached).toBeFalsy();
        });

        it('should get currentUser undefined', function() {
            expect(scope.currentUser).toBeUndefined();
        });
    });
});
