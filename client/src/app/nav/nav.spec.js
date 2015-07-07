/**
 * Created by michaelfisher on 7/7/15.
 */
describe('NavigationController', function () {
    var $location, $controller;
    beforeEach(function () {
        module('navCtrl');
    });
    beforeEach(inject(function (_$controller_, _$location_) {
        $controller = _$controller_;
        $location = _$location_;
    }));

    it('should have a method to check if the path is active', function () {
        var controller = $controller('NavigationController');
        $location.path('/about');
        expect($location.path()).toBe('/about');
        expect(controller.isActive('/about')).toBe(true);
        expect(controller.isActive('/contact')).toBe(false);
    });
});