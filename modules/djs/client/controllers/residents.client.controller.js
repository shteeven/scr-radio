'use strict';

// Residents controller
angular.module('residents').controller('ResidentsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Residents', 'Programs', 'Shows',
  function ($scope, $stateParams, $location, Authentication, Residents, Programs, Shows) {
    $scope.authentication = Authentication;



    // Clear forms
    $scope.clear = function(){
      $scope.dj.title = '';
      $scope.dj.image = '';
      $scope.dj.images = [];
      $scope.dj.links = {};
      $scope.dj.categories = [];
      $scope.dj.description = {};
      $scope.dj.guest = false;
      $scope.dj.featured = false;
    };

    // Create new Dj
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'djForm');

        return false;
      }

      // Create new Dj object
      var dj = new Residents({
        title: $scope.dj.title,
        image: $scope.dj.image,
        images: $scope.dj.images,
        links: $scope.dj.links,
        categories: $scope.dj.categories,
        description: $scope.dj.description,
        guest: $scope.dj.guest,
        featured: $scope.dj.featured
      });

      // Redirect after save
      dj.$save(function (response) {

        $location.path('residents/' + response._id);

        // Clear form fields
        $scope.clear();

      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Dj
    $scope.remove = function (dj) {
      if (dj) {
        dj.$remove();

        for (var i in $scope.residents) {
          if ($scope.residents[i] === dj) {
            $scope.residents.splice(i, 1);
          }
        }
      } else {
        $scope.dj.$remove(function () {
          $location.path('residents');
        });
      }
    };

    // Update existing Dj
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'djForm');

        return false;
      }

      var dj = $scope.dj;

      dj.$update(function () {

        $location.path('residents/' + dj._id);

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

    // Find existing Dj
    // TODO: this is a bit ridiculous
    $scope.findOne = function () {
      $scope.dj = Residents.get({
        djId: $stateParams.djId
      }, function(data) {
        $scope.changeBg(data.image);
      });
      $scope.programs = Programs.query({
        djId: $stateParams.djId,
        limit: 5
      });
      $scope.shows = Shows.query({
        djId: $stateParams.djId,
        limit: 10
      });

    };

  }
]);
