'use strict';

(function () {
  // Contents Controller Spec
  describe('Contents Controller Tests', function () {
    // Initialize global variables
    var ContentsController,
      scope,
      $httpBackend,
      $stateParams,
      $location,
      Authentication,
      Contents,
      mockContent;

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
    beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _Authentication_, _Contents_) {
      // Set a new global scope
      scope = $rootScope.$new();

      // Point global variables to injected services
      $stateParams = _$stateParams_;
      $httpBackend = _$httpBackend_;
      $location = _$location_;
      Authentication = _Authentication_;
      Contents = _Contents_;

      // create mock content
      mockContent = new Contents({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An Content about MEAN',
        content: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Contents controller.
      ContentsController = $controller('ContentsController', {
        $scope: scope
      });
    }));

    it('$scope.find() should create an array with at least one content object fetched from XHR', inject(function (Contents) {
      // Create a sample contents array that includes the new content
      var sampleContents = [mockContent];

      // Set GET response
      $httpBackend.expectGET('api/contents').respond(sampleContents);

      // Run controller functionality
      scope.find();
      $httpBackend.flush();

      // Test scope value
      expect(scope.contents).toEqualData(sampleContents);
    }));

    it('$scope.findOne() should create an array with one content object fetched from XHR using a contentId URL parameter', inject(function (Contents) {
      // Set the URL parameter
      $stateParams.contentId = mockContent._id;

      // Set GET response
      $httpBackend.expectGET(/api\/contents\/([0-9a-fA-F]{24})$/).respond(mockContent);

      // Run controller functionality
      scope.findOne();
      $httpBackend.flush();

      // Test scope value
      expect(scope.content).toEqualData(mockContent);
    }));

    describe('$scope.create()', function () {
      var sampleContentPostData;

      beforeEach(function () {
        // Create a sample content object
        sampleContentPostData = new Contents({
          title: 'An Content about MEAN',
          content: 'MEAN rocks!'
        });

        // Fixture mock form input values
        scope.title = 'An Content about MEAN';
        scope.content = 'MEAN rocks!';

        spyOn($location, 'path');
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (Contents) {
        // Set POST response
        $httpBackend.expectPOST('api/contents', sampleContentPostData).respond(mockContent);

        // Run controller functionality
        scope.create(true);
        $httpBackend.flush();

        // Test form inputs are reset
        expect(scope.title).toEqual('');
        expect(scope.content).toEqual('');

        // Test URL redirection after the content was created
        expect($location.path.calls.mostRecent().args[0]).toBe('contents/' + mockContent._id);
      }));

      it('should set scope.error if save error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/contents', sampleContentPostData).respond(400, {
          message: errorMessage
        });

        scope.create(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      });
    });

    describe('$scope.update()', function () {
      beforeEach(function () {
        // Mock content in scope
        scope.content = mockContent;
      });

      it('should update a valid content', inject(function (Contents) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/contents\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        scope.update(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($location.path()).toBe('/contents/' + mockContent._id);
      }));

      it('should set scope.error to error response message', inject(function (Contents) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/contents\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        scope.update(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      }));
    });

    describe('$scope.remove(content)', function () {
      beforeEach(function () {
        // Create new contents array and include the content
        scope.contents = [mockContent, {}];

        // Set expected DELETE response
        $httpBackend.expectDELETE(/api\/contents\/([0-9a-fA-F]{24})$/).respond(204);

        // Run controller functionality
        scope.remove(mockContent);
      });

      it('should send a DELETE request with a valid contentId and remove the content from the scope', inject(function (Contents) {
        expect(scope.contents.length).toBe(1);
      }));
    });

    describe('scope.remove()', function () {
      beforeEach(function () {
        spyOn($location, 'path');
        scope.content = mockContent;

        $httpBackend.expectDELETE(/api\/contents\/([0-9a-fA-F]{24})$/).respond(204);

        scope.remove();
        $httpBackend.flush();
      });

      it('should redirect to contents', function () {
        expect($location.path).toHaveBeenCalledWith('contents');
      });
    });
  });
}());
