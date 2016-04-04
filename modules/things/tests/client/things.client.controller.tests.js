'use strict';

(function () {
  // Things Controller Spec
  describe('Things Controller Tests', function () {
    // Initialize global variables
    var ThingsController,
      scope,
      $httpBackend,
      $stateParams,
      $location,
      Authentication,
      Things,
      mockThing;

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

    // Then we can thingt by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _Authentication_, _Things_) {
      // Set a new global scope
      scope = $rootScope.$new();

      // Point global variables to injected services
      $stateParams = _$stateParams_;
      $httpBackend = _$httpBackend_;
      $location = _$location_;
      Authentication = _Authentication_;
      Things = _Things_;

      // create mock thing
      mockThing = new Things({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An Thing about MEAN',
        content: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Things controller.
      ThingsController = $controller('ThingsController', {
        $scope: scope
      });
    }));

    it('$scope.find() should create an array with at least one thing object fetched from XHR', inject(function (Things) {
      // Create a sample things array that includes the new thing
      var sampleThings = [mockThing];

      // Set GET response
      $httpBackend.expectGET('api/things').respond(sampleThings);

      // Run controller functionality
      scope.find();
      $httpBackend.flush();

      // Test scope value
      expect(scope.things).toEqualData(sampleThings);
    }));

    it('$scope.findOne() should create an array with one thing object fetched from XHR using a thingId URL parameter', inject(function (Things) {
      // Set the URL parameter
      $stateParams.thingId = mockThing._id;

      // Set GET response
      $httpBackend.expectGET(/api\/things\/([0-9a-fA-F]{24})$/).respond(mockThing);

      // Run controller functionality
      scope.findOne();
      $httpBackend.flush();

      // Test scope value
      expect(scope.thing).toEqualData(mockThing);
    }));

    describe('$scope.create()', function () {
      var sampleThingPostData;

      beforeEach(function () {
        // Create a sample thing object
        sampleThingPostData = new Things({
          title: 'An Thing about MEAN',
          content: 'MEAN rocks!'
        });

        // Fixture mock form input values
        scope.title = 'An Thing about MEAN';
        scope.content = 'MEAN rocks!';

        spyOn($location, 'path');
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (Things) {
        // Set POST response
        $httpBackend.expectPOST('api/things', sampleThingPostData).respond(mockThing);

        // Run controller functionality
        scope.create(true);
        $httpBackend.flush();

        // Test form inputs are reset
        expect(scope.title).toEqual('');
        expect(scope.content).toEqual('');

        // Test URL redirection after the thing was created
        expect($location.path.calls.mostRecent().args[0]).toBe('things/' + mockThing._id);
      }));

      it('should set scope.error if save error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/things', sampleThingPostData).respond(400, {
          message: errorMessage
        });

        scope.create(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      });
    });

    describe('$scope.update()', function () {
      beforeEach(function () {
        // Mock thing in scope
        scope.thing = mockThing;
      });

      it('should update a valid thing', inject(function (Things) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/things\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        scope.update(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($location.path()).toBe('/things/' + mockThing._id);
      }));

      it('should set scope.error to error response message', inject(function (Things) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/things\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        scope.update(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      }));
    });

    describe('$scope.remove(thing)', function () {
      beforeEach(function () {
        // Create new things array and include the thing
        scope.things = [mockThing, {}];

        // Set expected DELETE response
        $httpBackend.expectDELETE(/api\/things\/([0-9a-fA-F]{24})$/).respond(204);

        // Run controller functionality
        scope.remove(mockThing);
      });

      it('should send a DELETE request with a valid thingId and remove the thing from the scope', inject(function (Things) {
        expect(scope.things.length).toBe(1);
      }));
    });

    describe('scope.remove()', function () {
      beforeEach(function () {
        spyOn($location, 'path');
        scope.thing = mockThing;

        $httpBackend.expectDELETE(/api\/things\/([0-9a-fA-F]{24})$/).respond(204);

        scope.remove();
        $httpBackend.flush();
      });

      it('should redirect to things', function () {
        expect($location.path).toHaveBeenCalledWith('things');
      });
    });
  });
}());
