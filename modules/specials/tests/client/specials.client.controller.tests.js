'use strict';

(function () {
  // Specials Controller Spec
  describe('Specials Controller Tests', function () {
    // Initialize global variables
    var SpecialsController,
      scope,
      $httpBackend,
      $stateParams,
      $location,
      Authentication,
      Specials,
      mockSpecial;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can specialt by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _Authentication_, _Specials_) {
      // Set a new global scope
      scope = $rootScope.$new();

      // Point global variables to injected services
      $stateParams = _$stateParams_;
      $httpBackend = _$httpBackend_;
      $location = _$location_;
      Authentication = _Authentication_;
      Specials = _Specials_;

      // create mock special
      mockSpecial = new Specials({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An Special about MEAN',
        content: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Specials controller.
      SpecialsController = $controller('SpecialsController', {
        $scope: scope
      });
    }));

    it('$scope.find() should create an array with at least one special object fetched from XHR', inject(function (Specials) {
      // Create a sample specials array that includes the new special
      var sampleSpecials = [mockSpecial];

      // Set GET response
      $httpBackend.expectGET('api/specials').respond(sampleSpecials);

      // Run controller functionality
      scope.find();
      $httpBackend.flush();

      // Test scope value
      expect(scope.specials).toEqualData(sampleSpecials);
    }));

    it('$scope.findOne() should create an array with one special object fetched from XHR using a specialId URL parameter', inject(function (Specials) {
      // Set the URL parameter
      $stateParams.specialId = mockSpecial._id;

      // Set GET response
      $httpBackend.expectGET(/api\/specials\/([0-9a-fA-F]{24})$/).respond(mockSpecial);

      // Run controller functionality
      scope.findOne();
      $httpBackend.flush();

      // Test scope value
      expect(scope.special).toEqualData(mockSpecial);
    }));

    describe('$scope.create()', function () {
      var sampleSpecialPostData;

      beforeEach(function () {
        // Create a sample special object
        sampleSpecialPostData = new Specials({
          title: 'An Special about MEAN',
          content: 'MEAN rocks!'
        });

        // Fixture mock form input values
        scope.title = 'An Special about MEAN';
        scope.content = 'MEAN rocks!';

        spyOn($location, 'path');
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (Specials) {
        // Set POST response
        $httpBackend.expectPOST('api/specials', sampleSpecialPostData).respond(mockSpecial);

        // Run controller functionality
        scope.create(true);
        $httpBackend.flush();

        // Test form inputs are reset
        expect(scope.title).toEqual('');
        expect(scope.content).toEqual('');

        // Test URL redirection after the special was created
        expect($location.path.calls.mostRecent().args[0]).toBe('specials/' + mockSpecial._id);
      }));

      it('should set scope.error if save error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/specials', sampleSpecialPostData).respond(400, {
          message: errorMessage
        });

        scope.create(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      });
    });

    describe('$scope.update()', function () {
      beforeEach(function () {
        // Mock special in scope
        scope.special = mockSpecial;
      });

      it('should update a valid special', inject(function (Specials) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/specials\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        scope.update(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($location.path()).toBe('/specials/' + mockSpecial._id);
      }));

      it('should set scope.error to error response message', inject(function (Specials) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/specials\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        scope.update(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      }));
    });

    describe('$scope.remove(special)', function () {
      beforeEach(function () {
        // Create new specials array and include the special
        scope.specials = [mockSpecial, {}];

        // Set expected DELETE response
        $httpBackend.expectDELETE(/api\/specials\/([0-9a-fA-F]{24})$/).respond(204);

        // Run controller functionality
        scope.remove(mockSpecial);
      });

      it('should send a DELETE request with a valid specialId and remove the special from the scope', inject(function (Specials) {
        expect(scope.specials.length).toBe(1);
      }));
    });

    describe('scope.remove()', function () {
      beforeEach(function () {
        spyOn($location, 'path');
        scope.special = mockSpecial;

        $httpBackend.expectDELETE(/api\/specials\/([0-9a-fA-F]{24})$/).respond(204);

        scope.remove();
        $httpBackend.flush();
      });

      it('should redirect to specials', function () {
        expect($location.path).toHaveBeenCalledWith('specials');
      });
    });
  });
}());
