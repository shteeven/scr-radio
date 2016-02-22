'use strict';

(function () {
  // Stars Controller Spec
  describe('Stars Controller Tests', function () {
    // Initialize global variables
    var StarsController,
      scope,
      $httpBackend,
      $stateParams,
      $location,
      Authentication,
      Stars,
      mockStar;

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

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _Authentication_, _Stars_) {
      // Set a new global scope
      scope = $rootScope.$new();

      // Point global variables to injected services
      $stateParams = _$stateParams_;
      $httpBackend = _$httpBackend_;
      $location = _$location_;
      Authentication = _Authentication_;
      Stars = _Stars_;

      // create mock star
      mockStar = new Stars({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An Star about MEAN',
        content: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Stars controller.
      StarsController = $controller('StarsController', {
        $scope: scope
      });
    }));

    it('$scope.find() should create an array with at least one star object fetched from XHR', inject(function (Stars) {
      // Create a sample stars array that includes the new star
      var sampleStars = [mockStar];

      // Set GET response
      $httpBackend.expectGET('api/stars').respond(sampleStars);

      // Run controller functionality
      scope.find();
      $httpBackend.flush();

      // Test scope value
      expect(scope.stars).toEqualData(sampleStars);
    }));

    it('$scope.findOne() should create an array with one star object fetched from XHR using a starId URL parameter', inject(function (Stars) {
      // Set the URL parameter
      $stateParams.starId = mockStar._id;

      // Set GET response
      $httpBackend.expectGET(/api\/stars\/([0-9a-fA-F]{24})$/).respond(mockStar);

      // Run controller functionality
      scope.findOne();
      $httpBackend.flush();

      // Test scope value
      expect(scope.star).toEqualData(mockStar);
    }));

    describe('$scope.create()', function () {
      var sampleStarPostData;

      beforeEach(function () {
        // Create a sample star object
        sampleStarPostData = new Stars({
          title: 'An Star about MEAN',
          content: 'MEAN rocks!'
        });

        // Fixture mock form input values
        scope.title = 'An Star about MEAN';
        scope.content = 'MEAN rocks!';

        spyOn($location, 'path');
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (Stars) {
        // Set POST response
        $httpBackend.expectPOST('api/stars', sampleStarPostData).respond(mockStar);

        // Run controller functionality
        scope.create(true);
        $httpBackend.flush();

        // Test form inputs are reset
        expect(scope.title).toEqual('');
        expect(scope.content).toEqual('');

        // Test URL redirection after the star was created
        expect($location.path.calls.mostRecent().args[0]).toBe('stars/' + mockStar._id);
      }));

      it('should set scope.error if save error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/stars', sampleStarPostData).respond(400, {
          message: errorMessage
        });

        scope.create(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      });
    });

    describe('$scope.update()', function () {
      beforeEach(function () {
        // Mock star in scope
        scope.star = mockStar;
      });

      it('should update a valid star', inject(function (Stars) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/stars\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        scope.update(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($location.path()).toBe('/stars/' + mockStar._id);
      }));

      it('should set scope.error to error response message', inject(function (Stars) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/stars\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        scope.update(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      }));
    });

    describe('$scope.remove(star)', function () {
      beforeEach(function () {
        // Create new stars array and include the star
        scope.stars = [mockStar, {}];

        // Set expected DELETE response
        $httpBackend.expectDELETE(/api\/stars\/([0-9a-fA-F]{24})$/).respond(204);

        // Run controller functionality
        scope.remove(mockStar);
      });

      it('should send a DELETE request with a valid starId and remove the star from the scope', inject(function (Stars) {
        expect(scope.stars.length).toBe(1);
      }));
    });

    describe('scope.remove()', function () {
      beforeEach(function () {
        spyOn($location, 'path');
        scope.star = mockStar;

        $httpBackend.expectDELETE(/api\/stars\/([0-9a-fA-F]{24})$/).respond(204);

        scope.remove();
        $httpBackend.flush();
      });

      it('should redirect to stars', function () {
        expect($location.path).toHaveBeenCalledWith('stars');
      });
    });
  });
}());
