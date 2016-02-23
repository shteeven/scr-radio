'use strict';

// Djs controller
angular.module('djs').controller('DjsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Djs',
  function ($scope, $stateParams, $location, Authentication, Djs) {
    $scope.authentication = Authentication;
    $scope.language = 'en';


    // Create new Dj
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'djForm');

        return false;
      }

      // Create new Dj object
      var dj = new Djs({
        title: this.title,
        image: this.image,
        images: this.images,
        categories: this.categories,
        description: this.description,
        links: this.links
      });

      // Redirect after save
      dj.$save(function (response) {

        $location.path('djs/' + response._id);

        // Clear form fields
        $scope.title = '';
        $scope.profileImageURL = '';
        $scope.images = [];
        $scope.categories = [];
        $scope.description = {};
        $scope.userID = '';
        $scope.social = {};

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

        // Clear form fields
        $scope.title = '';
        $scope.profileImageURL = '';
        $scope.images = [];
        $scope.categories = [];
        $scope.description = {};
        $scope.userID = '';
        $scope.social = {};

      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Djs
    $scope.find = function () {
      $scope.djs = Djs.query();
    };

    // Find existing Dj
    $scope.findOne = function () {
      $scope.dj = Djs.get({
        djId: $stateParams.djId
      });
    };
  }
]);
