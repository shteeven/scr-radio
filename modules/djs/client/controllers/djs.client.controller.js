'use strict';

// Djs controller
angular.module('djs').controller('DjsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Djs', 'Programs', 'Shows',
  function ($scope, $stateParams, $location, Authentication, Djs, Programs, Shows) {
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
      var dj = new Djs({
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

        $location.path('djs/' + response._id);

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

        for (var i in $scope.djs) {
          if ($scope.djs[i] === dj) {
            $scope.djs.splice(i, 1);
          }
        }
      } else {
        $scope.dj.$remove(function () {
          $location.path('djs');
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

        $location.path('djs/' + dj._id);

      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Djs
    $scope.find = function () {
      $scope.djs = Djs.query();
    };

    // Find existing Dj
    // TODO: this is a bit ridiculous
    $scope.findOne = function () {
      $scope.dj = Djs.get({
        djId: $stateParams.djId
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
