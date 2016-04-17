'use strict';

(function () {
  // Regulars Controller Spec
  describe('Regulars Controller Tests', function () {
    // Initialize global variables
    var RegularsController,
      scope,
      $httpBackend,
      $stateParams,
      $location,
      Authentication,
      Regulars,
      mockRegular;

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

    // Then we can regulart by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _Authentication_, _Regulars_) {
      // Set a new global scope
      scope = $rootScope.$new();

      // Point global variables to injected services
      $stateParams = _$stateParams_;
      $httpBackend = _$httpBackend_;
      $location = _$location_;
      Authentication = _Authentication_;
      Regulars = _Regulars_;

      // create mock regular
      mockRegular = new Regulars({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An Regular about MEAN',
        content: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Regulars controller.
      RegularsController = $controller('RegularsController', {
        $scope: scope
      });
    }));

    it('$scope.find() should create an array with at least one regular object fetched from XHR', inject(function (Regulars) {
      // Create a sample regulars array that includes the new regular
      var sampleRegulars = [mockRegular];

      // Set GET response
      $httpBackend.expectGET('api/regulars').respond(sampleRegulars);

      // Run controller functionality
      scope.find();
      $httpBackend.flush();

      // Test scope value
      expect(scope.regulars).toEqualData(sampleRegulars);
    }));

    it('$scope.findOne() should create an array with one regular object fetched from XHR using a regularId URL parameter', inject(function (Regulars) {
      // Set the URL parameter
      $stateParams.regularId = mockRegular._id;

      // Set GET response
      $httpBackend.expectGET(/api\/regulars\/([0-9a-fA-F]{24})$/).respond(mockRegular);

      // Run controller functionality
      scope.findOne();
      $httpBackend.flush();

      // Test scope value
      expect(scope.regular).toEqualData(mockRegular);
    }));

    describe('$scope.create()', function () {
      var sampleRegularPostData;

      beforeEach(function () {
        // Create a sample regular object
        sampleRegularPostData = new Regulars({
          title: 'An Regular about MEAN',
          content: 'MEAN rocks!'
        });

        // Fixture mock form input values
        scope.title = 'An Regular about MEAN';
        scope.content = 'MEAN rocks!';

        spyOn($location, 'path');
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (Regulars) {
        // Set POST response
        $httpBackend.expectPOST('api/regulars', sampleRegularPostData).respond(mockRegular);

        // Run controller functionality
        scope.create(true);
        $httpBackend.flush();

        // Test form inputs are reset
        expect(scope.title).toEqual('');
        expect(scope.content).toEqual('');

        // Test URL redirection after the regular was created
        expect($location.path.calls.mostRecent().args[0]).toBe('regulars/' + mockRegular._id);
      }));

      it('should set scope.error if save error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/regulars', sampleRegularPostData).respond(400, {
          message: errorMessage
        });

        scope.create(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      });
    });

    describe('$scope.update()', function () {
      beforeEach(function () {
        // Mock regular in scope
        scope.regular = mockRegular;
      });

      it('should update a valid regular', inject(function (Regulars) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/regulars\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        scope.update(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($location.path()).toBe('/regulars/' + mockRegular._id);
      }));

      it('should set scope.error to error response message', inject(function (Regulars) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/regulars\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        scope.update(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      }));
    });

    describe('$scope.remove(regular)', function () {
      beforeEach(function () {
        // Create new regulars array and include the regular
        scope.regulars = [mockRegular, {}];

        // Set expected DELETE response
        $httpBackend.expectDELETE(/api\/regulars\/([0-9a-fA-F]{24})$/).respond(204);

        // Run controller functionality
        scope.remove(mockRegular);
      });

      it('should send a DELETE request with a valid regularId and remove the regular from the scope', inject(function (Regulars) {
        expect(scope.regulars.length).toBe(1);
      }));
    });

    describe('scope.remove()', function () {
      beforeEach(function () {
        spyOn($location, 'path');
        scope.regular = mockRegular;

        $httpBackend.expectDELETE(/api\/regulars\/([0-9a-fA-F]{24})$/).respond(204);

        scope.remove();
        $httpBackend.flush();
      });

      it('should redirect to regulars', function () {
        expect($location.path).toHaveBeenCalledWith('regulars');
      });
    });
  });
}());
