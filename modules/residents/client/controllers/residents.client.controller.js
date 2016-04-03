'use strict';

// Residents controller
angular.module('residents').controller('ResidentsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Residents', 'Programs', 'Episodes',
  function ($scope, $stateParams, $location, Authentication, Residents, Programs, Episodes) {
    $scope.authentication = Authentication;



    // Clear forms
    $scope.clear = function(){
      $scope.resident.title = '';
      $scope.resident.image = '';
      $scope.resident.images = [];
      $scope.resident.links = {};
      $scope.resident.categories = [];
      $scope.resident.description = {};
      $scope.resident.guest = false;
      $scope.resident.featured = false;
    };

    // Create new Resident
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'residentForm');

        return false;
      }

      // Create new Resident object
      var resident = new Residents({
        title: $scope.resident.title,
        image: $scope.resident.image,
        images: $scope.resident.images,
        links: $scope.resident.links,
        categories: $scope.resident.categories,
        description: $scope.resident.description,
        guest: $scope.resident.guest,
        featured: $scope.resident.featured
      });

      // Redirect after save
      resident.$save(function (response) {

        $location.path('residents/' + response._id);

        // Clear form fields
        $scope.clear();

      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Resident
    $scope.remove = function (resident) {
      if (resident) {
        resident.$remove();

        for (var i in $scope.residents) {
          if ($scope.residents[i] === resident) {
            $scope.residents.splice(i, 1);
          }
        }
      } else {
        $scope.resident.$remove(function () {
          $location.path('residents');
        });
      }
    };

    // Update existing Resident
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'residentForm');

        return false;
      }

      var resident = $scope.resident;

      resident.$update(function () {

        $location.path('residents/' + resident._id);

      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Residents
    $scope.find = function () {
      $scope.residents = Residents.query({}, function (data) {
        var item = data[Math.floor(Math.random()*data.length)];
        $scope.changeBg(item.image);
      });
    };

    // Find existing Resident
    // TODO: this is a bit ridiculous
    $scope.findOne = function () {
      $scope.resident = Residents.get({
        residentId: $stateParams.residentId
      }, function(data) {
        $scope.changeBg(data.image);
      });
      $scope.programs = Programs.query({
        residentId: $stateParams.residentId,
        limit: 5
      });
      $scope.episodes = Episodes.query({
        residentId: $stateParams.residentId,
        limit: 10
      });

    };

  }
]);
