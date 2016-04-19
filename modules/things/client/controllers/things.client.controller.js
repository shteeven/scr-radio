'use strict';

// Things controller
angular.module('things').controller('ThingsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Things', 'Specials', 'Episodes', 'Regulars',
  function ($scope, $stateParams, $location, Authentication, Things, Specials, Episodes, Regulars) {
    $scope.authentication = Authentication;



    // Clear forms
    $scope.clear = function(){
      $scope.thing.title = '';
      $scope.thing.heading = undefined;
      $scope.thing.description = {};
      $scope.thing.resourceType = undefined;
      $scope.thing.resource = undefined;
      $scope.thing.image = undefined;
      $scope.thing.links = {};
      $scope.thing.category = undefined;
      $scope.thing.priority = undefined;
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
        heading: $scope.thing.heading,
        image: $scope.thing.image,
        resourceType: $scope.thing.resourceType,
        resource: $scope.thing.resource,
        links: $scope.thing.links,
        category: $scope.thing.category,
        description: $scope.thing.description,
        priority: $scope.thing.priority
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
      $scope.specials = Specials.query();
      $scope.episodes = Episodes.query();
      $scope.regulars = Regulars.query();
    };

  }
]);
