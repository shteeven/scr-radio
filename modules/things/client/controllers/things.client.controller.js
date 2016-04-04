'use strict';

// Things controller
angular.module('things').controller('ThingsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Things', 'Programs', 'Episodes',
  function ($scope, $stateParams, $location, Authentication, Things, Programs, Episodes) {
    $scope.authentication = Authentication;



    // Clear forms
    $scope.clear = function(){
      $scope.thing.title = '';
      $scope.thing.image = '';
      $scope.thing.images = [];
      $scope.thing.links = {};
      $scope.thing.categories = [];
      $scope.thing.description = {};
      $scope.thing.guest = false;
      $scope.thing.featured = false;
    };

    // Create new Thing
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'thingForm');

        return false;
      }

      // Create new Thing object
      var thing = new Things({
        title: $scope.thing.title,
        image: $scope.thing.image,
        images: $scope.thing.images,
        links: $scope.thing.links,
        categories: $scope.thing.categories,
        description: $scope.thing.description,
        guest: $scope.thing.guest,
        featured: $scope.thing.featured
      });

      // Redirect after save
      thing.$save(function (response) {

        $location.path('things/' + response._id);

        // Clear form fields
        $scope.clear();

      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Thing
    $scope.remove = function (thing) {
      if (thing) {
        thing.$remove();

        for (var i in $scope.things) {
          if ($scope.things[i] === thing) {
            $scope.things.splice(i, 1);
          }
        }
      } else {
        $scope.thing.$remove(function () {
          $location.path('things');
        });
      }
    };

    // Update existing Thing
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'thingForm');

        return false;
      }

      var thing = $scope.thing;

      thing.$update(function () {

        $location.path('things/' + thing._id);

      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Things
    $scope.find = function () {
      $scope.things = Things.query({}, function (data) {
        var item = data[Math.floor(Math.random()*data.length)];
        $scope.changeBg(item.image);
      });
    };

    // Find existing Thing
    // TODO: this is a bit ridiculous
    $scope.findOne = function () {
      $scope.thing = Things.get({
        thingId: $stateParams.thingId
      }, function(data) {
        $scope.changeBg(data.image);
      });
      $scope.programs = Programs.query({
        thingId: $stateParams.thingId,
        limit: 5
      });
      $scope.episodes = Episodes.query({
        thingId: $stateParams.thingId,
        limit: 10
      });

    };

  }
]);
