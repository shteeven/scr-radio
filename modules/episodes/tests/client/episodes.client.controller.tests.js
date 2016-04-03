'use strict';

(function () {
  // Episodes Controller Spec
  describe('Episodes Controller Tests', function () {
    // Initialize global variables
    var EpisodesController,
      scope,
      $httpBackend,
      $stateParams,
      $location,
      Authentication,
      Episodes,
      mockEpisode;

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

    // Then we can show it by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _Authentication_, _Episodes_) {
      // Set a new global scope
      scope = $rootScope.$new();

      // Point global variables to injected services
      $stateParams = _$stateParams_;
      $httpBackend = _$httpBackend_;
      $location = _$location_;
      Authentication = _Authentication_;
      Episodes = _Episodes_;

      // create mock episode
      mockEpisode = new Episodes({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An Episode about MEAN',
        content: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Episodes controller.
      EpisodesController = $controller('EpisodesController', {
        $scope: scope
      });
    }));

    it('$scope.find() should create an array with at least one episode object fetched from XHR', inject(function (Episodes) {
      // Create a sample episodes array that includes the new episode
      var sampleEpisodes = [mockEpisode];

      // Set GET response
      $httpBackend.expectGET('api/episodes').respond(sampleEpisodes);

      // Run controller functionality
      scope.find();
      $httpBackend.flush();

      // Test scope value
      expect(scope.episodes).toEqualData(sampleEpisodes);
    }));

    it('$scope.findOne() should create an array with one episode object fetched from XHR using a episodeId URL parameter', inject(function (Episodes) {
      // Set the URL parameter
      $stateParams.episodeId = mockEpisode._id;

      // Set GET response
      $httpBackend.expectGET(/api\/episodes\/([0-9a-fA-F]{24})$/).respond(mockEpisode);

      // Run controller functionality
      scope.findOne();
      $httpBackend.flush();

      // Test scope value
      expect(scope.episode).toEqualData(mockEpisode);
    }));

    describe('$scope.create()', function () {
      var sampleEpisodePostData;

      beforeEach(function () {
        // Create a sample episode object
        sampleEpisodePostData = new Episodes({
          title: 'An Episode about MEAN',
          content: 'MEAN rocks!'
        });

        // Fixture mock form input values
        scope.title = 'An Episode about MEAN';
        scope.content = 'MEAN rocks!';

        spyOn($location, 'path');
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (Episodes) {
        // Set POST response
        $httpBackend.expectPOST('api/episodes', sampleEpisodePostData).respond(mockEpisode);

        // Run controller functionality
        scope.create(true);
        $httpBackend.flush();

        // Test form inputs are reset
        expect(scope.title).toEqual('');
        expect(scope.content).toEqual('');

        // Test URL redirection after the episode was created
        expect($location.path.calls.mostRecent().args[0]).toBe('episodes/' + mockEpisode._id);
      }));

      it('should set scope.error if save error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/episodes', sampleEpisodePostData).respond(400, {
          message: errorMessage
        });

        scope.create(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      });
    });

    describe('$scope.update()', function () {
      beforeEach(function () {
        // Mock episode in scope
        scope.episode = mockEpisode;
      });

      it('should update a valid episode', inject(function (Episodes) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/episodes\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        scope.update(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($location.path()).toBe('/episodes/' + mockEpisode._id);
      }));

      it('should set scope.error to error response message', inject(function (Episodes) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/episodes\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        scope.update(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      }));
    });

    describe('$scope.remove(episode)', function () {
      beforeEach(function () {
        // Create new episodes array and include the episode
        scope.episodes = [mockEpisode, {}];

        // Set expected DELETE response
        $httpBackend.expectDELETE(/api\/episodes\/([0-9a-fA-F]{24})$/).respond(204);

        // Run controller functionality
        scope.remove(mockEpisode);
      });

      it('should send a DELETE request with a valid episodeId and remove the episode from the scope', inject(function (Episodes) {
        expect(scope.episodes.length).toBe(1);
      }));
    });

    describe('scope.remove()', function () {
      beforeEach(function () {
        spyOn($location, 'path');
        scope.episode = mockEpisode;

        $httpBackend.expectDELETE(/api\/episodes\/([0-9a-fA-F]{24})$/).respond(204);

        scope.remove();
        $httpBackend.flush();
      });

      it('should redirect to episodes', function () {
        expect($location.path).toHaveBeenCalledWith('episodes');
      });
    });
  });
}());
