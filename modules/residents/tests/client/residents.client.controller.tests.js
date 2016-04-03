'use strict';

(function () {
  // Residents Controller Spec
  describe('Residents Controller Tests', function () {
    // Initialize global variables
    var ResidentsController,
      scope,
      $httpBackend,
      $stateParams,
      $location,
      Authentication,
      Residents,
      mockResident;

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

    // Then we can residentt by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _Authentication_, _Residents_) {
      // Set a new global scope
      scope = $rootScope.$new();

      // Point global variables to injected services
      $stateParams = _$stateParams_;
      $httpBackend = _$httpBackend_;
      $location = _$location_;
      Authentication = _Authentication_;
      Residents = _Residents_;

      // create mock resident
      mockResident = new Residents({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An Resident about MEAN',
        content: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Residents controller.
      ResidentsController = $controller('ResidentsController', {
        $scope: scope
      });
    }));

    it('$scope.find() should create an array with at least one resident object fetched from XHR', inject(function (Residents) {
      // Create a sample residents array that includes the new resident
      var sampleResidents = [mockResident];

      // Set GET response
      $httpBackend.expectGET('api/residents').respond(sampleResidents);

      // Run controller functionality
      scope.find();
      $httpBackend.flush();

      // Test scope value
      expect(scope.residents).toEqualData(sampleResidents);
    }));

    it('$scope.findOne() should create an array with one resident object fetched from XHR using a residentId URL parameter', inject(function (Residents) {
      // Set the URL parameter
      $stateParams.residentId = mockResident._id;

      // Set GET response
      $httpBackend.expectGET(/api\/residents\/([0-9a-fA-F]{24})$/).respond(mockResident);

      // Run controller functionality
      scope.findOne();
      $httpBackend.flush();

      // Test scope value
      expect(scope.resident).toEqualData(mockResident);
    }));

    describe('$scope.create()', function () {
      var sampleResidentPostData;

      beforeEach(function () {
        // Create a sample resident object
        sampleResidentPostData = new Residents({
          title: 'An Resident about MEAN',
          content: 'MEAN rocks!'
        });

        // Fixture mock form input values
        scope.title = 'An Resident about MEAN';
        scope.content = 'MEAN rocks!';

        spyOn($location, 'path');
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (Residents) {
        // Set POST response
        $httpBackend.expectPOST('api/residents', sampleResidentPostData).respond(mockResident);

        // Run controller functionality
        scope.create(true);
        $httpBackend.flush();

        // Test form inputs are reset
        expect(scope.title).toEqual('');
        expect(scope.content).toEqual('');

        // Test URL redirection after the resident was created
        expect($location.path.calls.mostRecent().args[0]).toBe('residents/' + mockResident._id);
      }));

      it('should set scope.error if save error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/residents', sampleResidentPostData).respond(400, {
          message: errorMessage
        });

        scope.create(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      });
    });

    describe('$scope.update()', function () {
      beforeEach(function () {
        // Mock resident in scope
        scope.resident = mockResident;
      });

      it('should update a valid resident', inject(function (Residents) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/residents\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        scope.update(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($location.path()).toBe('/residents/' + mockResident._id);
      }));

      it('should set scope.error to error response message', inject(function (Residents) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/residents\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        scope.update(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      }));
    });

    describe('$scope.remove(resident)', function () {
      beforeEach(function () {
        // Create new residents array and include the resident
        scope.residents = [mockResident, {}];

        // Set expected DELETE response
        $httpBackend.expectDELETE(/api\/residents\/([0-9a-fA-F]{24})$/).respond(204);

        // Run controller functionality
        scope.remove(mockResident);
      });

      it('should send a DELETE request with a valid residentId and remove the resident from the scope', inject(function (Residents) {
        expect(scope.residents.length).toBe(1);
      }));
    });

    describe('scope.remove()', function () {
      beforeEach(function () {
        spyOn($location, 'path');
        scope.resident = mockResident;

        $httpBackend.expectDELETE(/api\/residents\/([0-9a-fA-F]{24})$/).respond(204);

        scope.remove();
        $httpBackend.flush();
      });

      it('should redirect to residents', function () {
        expect($location.path).toHaveBeenCalledWith('residents');
      });
    });
  });
}());
