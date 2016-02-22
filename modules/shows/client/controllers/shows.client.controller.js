'use strict';

// Shows controller
angular.module('shows').controller('ShowsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Shows',
  function ($scope, $stateParams, $location, Authentication, Shows) {
    $scope.authentication = Authentication;

    // Create new Show
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'showForm');

        return false;
      }

      // Create new Show object
      var show = new Shows({
        title: this.title,
        profileImageURL: this.profileImageURL,
        mixcloud: this.mixcloud,
        categories: this.categories,
        description: this.description,
        hostID: this.hostID,
        programID: this.programID,
        dateTime: this.dateTime,
        length: this.length
      });

      // Redirect after save
      show.$save(function (response) {

        $location.path('shows/' + response._id);

        // Clear form fields
        $scope.title = '';
        $scope.profileImageURL = '';
        $scope.mixcloud = '';
        $scope.categories = [];
        $scope.description = {};
        $scope.hostID = {};
        $scope.programID = '';
        $scope.dateTime = '';
        $scope.length = '';

      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Show
    $scope.remove = function (show) {
      if (show) {
        show.$remove();

        for (var i in $scope.shows) {
          if ($scope.shows[i] === show) {
            $scope.shows.splice(i, 1);
          }
        }
      } else {
        $scope.show.$remove(function () {
          $location.path('shows');
        });
      }
    };

    // Update existing Show
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'showForm');

        return false;
      }

      var show = $scope.show;

      show.$update(function () {

        $location.path('shows/' + show._id);

        // Clear form fields
        $scope.title = '';
        $scope.profileImageURL = '';
        $scope.mixcloud = '';
        $scope.categories = [];
        $scope.description = {};
        $scope.hostID = {};
        $scope.programID = '';
        $scope.dateTime = '';
        $scope.length = '';

      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Shows
    $scope.find = function () {
      $scope.shows = Shows.query();
    };

    // Find existing Show
    $scope.findOne = function () {
      $scope.show = Shows.get({
        showId: $stateParams.showId
      });
    };
  }
]);
