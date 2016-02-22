'use strict';

(function () {
  // Djs Controller Spec
  describe('Djs Controller Tests', function () {
    // Initialize global variables
    var DjsController,
      scope,
      $httpBackend,
      $stateParams,
      $location,
      Authentication,
      Djs,
      mockDj;

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

    // Then we can djt by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _Authentication_, _Djs_) {
      // Set a new global scope
      scope = $rootScope.$new();

      // Point global variables to injected services
      $stateParams = _$stateParams_;
      $httpBackend = _$httpBackend_;
      $location = _$location_;
      Authentication = _Authentication_;
      Djs = _Djs_;

      // create mock dj
      mockDj = new Djs({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An Dj about MEAN',
        content: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Djs controller.
      DjsController = $controller('DjsController', {
        $scope: scope
      });
    }));

    it('$scope.find() should create an array with at least one dj object fetched from XHR', inject(function (Djs) {
      // Create a sample djs array that includes the new dj
      var sampleDjs = [mockDj];

      // Set GET response
      $httpBackend.expectGET('api/djs').respond(sampleDjs);

      // Run controller functionality
      scope.find();
      $httpBackend.flush();

      // Test scope value
      expect(scope.djs).toEqualData(sampleDjs);
    }));

    it('$scope.findOne() should create an array with one dj object fetched from XHR using a djId URL parameter', inject(function (Djs) {
      // Set the URL parameter
      $stateParams.djId = mockDj._id;

      // Set GET response
      $httpBackend.expectGET(/api\/djs\/([0-9a-fA-F]{24})$/).respond(mockDj);

      // Run controller functionality
      scope.findOne();
      $httpBackend.flush();

      // Test scope value
      expect(scope.dj).toEqualData(mockDj);
    }));

    describe('$scope.create()', function () {
      var sampleDjPostData;

      beforeEach(function () {
        // Create a sample dj object
        sampleDjPostData = new Djs({
          title: 'An Dj about MEAN',
          content: 'MEAN rocks!'
        });

        // Fixture mock form input values
        scope.title = 'An Dj about MEAN';
        scope.content = 'MEAN rocks!';

        spyOn($location, 'path');
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (Djs) {
        // Set POST response
        $httpBackend.expectPOST('api/djs', sampleDjPostData).respond(mockDj);

        // Run controller functionality
        scope.create(true);
        $httpBackend.flush();

        // Test form inputs are reset
        expect(scope.title).toEqual('');
        expect(scope.content).toEqual('');

        // Test URL redirection after the dj was created
        expect($location.path.calls.mostRecent().args[0]).toBe('djs/' + mockDj._id);
      }));

      it('should set scope.error if save error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/djs', sampleDjPostData).respond(400, {
          message: errorMessage
        });

        scope.create(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      });
    });

    describe('$scope.update()', function () {
      beforeEach(function () {
        // Mock dj in scope
        scope.dj = mockDj;
      });

      it('should update a valid dj', inject(function (Djs) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/djs\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        scope.update(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($location.path()).toBe('/djs/' + mockDj._id);
      }));

      it('should set scope.error to error response message', inject(function (Djs) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/djs\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        scope.update(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      }));
    });

    describe('$scope.remove(dj)', function () {
      beforeEach(function () {
        // Create new djs array and include the dj
        scope.djs = [mockDj, {}];

        // Set expected DELETE response
        $httpBackend.expectDELETE(/api\/djs\/([0-9a-fA-F]{24})$/).respond(204);

        // Run controller functionality
        scope.remove(mockDj);
      });

      it('should send a DELETE request with a valid djId and remove the dj from the scope', inject(function (Djs) {
        expect(scope.djs.length).toBe(1);
      }));
    });

    describe('scope.remove()', function () {
      beforeEach(function () {
        spyOn($location, 'path');
        scope.dj = mockDj;

        $httpBackend.expectDELETE(/api\/djs\/([0-9a-fA-F]{24})$/).respond(204);

        scope.remove();
        $httpBackend.flush();
      });

      it('should redirect to djs', function () {
        expect($location.path).toHaveBeenCalledWith('djs');
      });
    });
  });
}());
