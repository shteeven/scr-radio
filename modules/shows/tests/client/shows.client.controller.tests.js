'use strict';

(function () {
  // Shows Controller Spec
  describe('Shows Controller Tests', function () {
    // Initialize global variables
    var ShowsController,
      scope,
      $httpBackend,
      $stateParams,
      $location,
      Authentication,
      Shows,
      mockShow;

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

    // Then we can showt by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _Authentication_, _Shows_) {
      // Set a new global scope
      scope = $rootScope.$new();

      // Point global variables to injected services
      $stateParams = _$stateParams_;
      $httpBackend = _$httpBackend_;
      $location = _$location_;
      Authentication = _Authentication_;
      Shows = _Shows_;

      // create mock show
      mockShow = new Shows({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An Show about MEAN',
        content: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Shows controller.
      ShowsController = $controller('ShowsController', {
        $scope: scope
      });
    }));

    it('$scope.find() should create an array with at least one show object fetched from XHR', inject(function (Shows) {
      // Create a sample shows array that includes the new show
      var sampleShows = [mockShow];

      // Set GET response
      $httpBackend.expectGET('api/shows').respond(sampleShows);

      // Run controller functionality
      scope.find();
      $httpBackend.flush();

      // Test scope value
      expect(scope.shows).toEqualData(sampleShows);
    }));

    it('$scope.findOne() should create an array with one show object fetched from XHR using a showId URL parameter', inject(function (Shows) {
      // Set the URL parameter
      $stateParams.showId = mockShow._id;

      // Set GET response
      $httpBackend.expectGET(/api\/shows\/([0-9a-fA-F]{24})$/).respond(mockShow);

      // Run controller functionality
      scope.findOne();
      $httpBackend.flush();

      // Test scope value
      expect(scope.show).toEqualData(mockShow);
    }));

    describe('$scope.create()', function () {
      var sampleShowPostData;

      beforeEach(function () {
        // Create a sample show object
        sampleShowPostData = new Shows({
          title: 'An Show about MEAN',
          content: 'MEAN rocks!'
        });

        // Fixture mock form input values
        scope.title = 'An Show about MEAN';
        scope.content = 'MEAN rocks!';

        spyOn($location, 'path');
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (Shows) {
        // Set POST response
        $httpBackend.expectPOST('api/shows', sampleShowPostData).respond(mockShow);

        // Run controller functionality
        scope.create(true);
        $httpBackend.flush();

        // Test form inputs are reset
        expect(scope.title).toEqual('');
        expect(scope.content).toEqual('');

        // Test URL redirection after the show was created
        expect($location.path.calls.mostRecent().args[0]).toBe('shows/' + mockShow._id);
      }));

      it('should set scope.error if save error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/shows', sampleShowPostData).respond(400, {
          message: errorMessage
        });

        scope.create(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      });
    });

    describe('$scope.update()', function () {
      beforeEach(function () {
        // Mock show in scope
        scope.show = mockShow;
      });

      it('should update a valid show', inject(function (Shows) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/shows\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        scope.update(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($location.path()).toBe('/shows/' + mockShow._id);
      }));

      it('should set scope.error to error response message', inject(function (Shows) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/shows\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        scope.update(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      }));
    });

    describe('$scope.remove(show)', function () {
      beforeEach(function () {
        // Create new shows array and include the show
        scope.shows = [mockShow, {}];

        // Set expected DELETE response
        $httpBackend.expectDELETE(/api\/shows\/([0-9a-fA-F]{24})$/).respond(204);

        // Run controller functionality
        scope.remove(mockShow);
      });

      it('should send a DELETE request with a valid showId and remove the show from the scope', inject(function (Shows) {
        expect(scope.shows.length).toBe(1);
      }));
    });

    describe('scope.remove()', function () {
      beforeEach(function () {
        spyOn($location, 'path');
        scope.show = mockShow;

        $httpBackend.expectDELETE(/api\/shows\/([0-9a-fA-F]{24})$/).respond(204);

        scope.remove();
        $httpBackend.flush();
      });

      it('should redirect to shows', function () {
        expect($location.path).toHaveBeenCalledWith('shows');
      });
    });
  });
}());
