'use strict';

// Shows controller
angular.module('shows').controller('ShowsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Shows', 'Djs',
  function ($scope, $stateParams, $location, Authentication, Shows, Djs) {
    $scope.authentication = Authentication;

    $scope.days = [
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
      'sunday'
    ];

    // This will fire when the create or edit page load
    $scope.getDjs = function() {
      $scope.djs = Djs.query();
    };

    // Insert DJ into the DJs list
    $scope.dj_names = {};
    $scope.addDj = function(dj) {
      if ($scope.show.djs.indexOf(dj._id) < 0) {
        $scope.show.djs.push(dj);
      }
    };

    // Clear forms
    $scope.clear = function(){
      $scope.show = {};
      $scope.show.title = '';
      $scope.show.image = '';
      $scope.show.images = [];
      $scope.show.links = {};
      $scope.show.categories = [];
      $scope.show.description = {};
      $scope.show.djs = [];
      $scope.show.schedule = {};
    };

    // Create new Show
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'showForm');

        return false;
      }

      // Create new Show object
      var show = new Shows({
        title: $scope.show.title,
        image: $scope.show.image,
        images: $scope.show.images,
        links: $scope.show.links,
        categories: $scope.show.categories,
        description: $scope.show.description,
        djs: $scope.show.djs,
        guests: $scope.show.guests
      });

      // Redirect after save
      show.$save(function (response) {

        $location.path('shows/' + response._id);

        // Clear form fields
        $scope.clear();

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
