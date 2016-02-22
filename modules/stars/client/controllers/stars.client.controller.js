'use strict';

// Stars controller
angular.module('stars').controller('StarsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Stars',
  function ($scope, $stateParams, $location, Authentication, Stars) {
    $scope.authentication = Authentication;
    $scope.language = 'en';


    // Create new Star
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'starForm');

        return false;
      }

      // Create new Star object
      var star = new Stars({
        title: this.title,
        profileImageURL: this.profileImageURL,
        images: this.images,
        categories: this.categories,
        description: this.description,
        user_id: this.userID,
        social: this.social
      });

      // Redirect after save
      star.$save(function (response) {

        $location.path('stars/' + response._id);

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

    // Remove existing Star
    $scope.remove = function (star) {
      if (star) {
        star.$remove();

        for (var i in $scope.stars) {
          if ($scope.stars[i] === star) {
            $scope.stars.splice(i, 1);
          }
        }
      } else {
        $scope.star.$remove(function () {
          $location.path('stars');
        });
      }
    };

    // Update existing Star
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'starForm');

        return false;
      }

      var star = $scope.star;

      star.$update(function () {

        $location.path('stars/' + star._id);

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

    // Find a list of Stars
    $scope.find = function () {
      $scope.stars = Stars.query();
    };

    // Find existing Star
    $scope.findOne = function () {
      $scope.star = Stars.get({
        starId: $stateParams.starId
      });
    };
  }
]);
