'use strict';

// Specials controller
angular.module('specials').controller('SpecialsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Specials', 'Regulars', 'Episodes',
  function ($scope, $stateParams, $location, Authentication, Specials, Regulars, Episodes) {
    $scope.authentication = Authentication;
    $scope.special = {};
    $scope.special.regulars = [];

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
    $scope.getRegulars = function() {
      $scope.regulars = Regulars.query();
    };

    // Insert REGULAR into the REGULARs list
    // regular arg is a REGULAR's _id
    $scope.addRegular = function(title) { // use of title instead of id is due to the object being passed as a string literal
      var regular = $scope.regulars.filter(function(regular) {
        return regular.title === title;
      })[0];
      if ($scope.special.regulars.indexOf(regular) < 0) { $scope.special.regulars.push(regular); }
    };
    $scope.removeRegular = function(regular) {
      $scope.special.regulars = $scope.special.regulars.filter(function (obj) { return obj !== regular; });
    };

    // Clear forms
    $scope.clear = function(){
      $scope.special = {};
      $scope.special.title = '';
      $scope.special.image = '';
      $scope.special.images = [];
      $scope.special.links = {};
      $scope.special.categories = [];
      $scope.special.description = {};
      $scope.special.regulars = [];
      $scope.special.schedule = {};
      $scope.special.featured = false;
    };

    // Create new Special
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'specialForm');

        return false;
      }

      // Create new Special object
      var special = new Specials({
        title: $scope.special.title,
        image: $scope.special.image,
        images: $scope.special.images,
        links: $scope.special.links,
        categories: $scope.special.categories,
        description: $scope.special.description,
        regulars: $scope.special.regulars,
        schedule: $scope.special.schedule,
        featured: $scope.special.featured
      });

      // Redirect after save
      special.$save(function (response) {

        $location.path('specials/' + response._id);

        // Clear form fields
        $scope.clear();

      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Special
    $scope.remove = function (special) {
      if (special) {
        special.$remove();

        for (var i in $scope.specials) {
          if ($scope.specials[i] === special) {
            $scope.specials.splice(i, 1);
          }
        }
      } else {
        $scope.special.$remove(function () {
          $location.path('specials');
        });
      }
    };

    // Update existing Special
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'specialForm');

        return false;
      }

      var special = $scope.special;

      special.$update(function () {

        $location.path('specials/' + special._id);

      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Specials
    $scope.find = function () {
      $scope.specials = Specials.query({}, function (data) {
        var item = data[Math.floor(Math.random()*data.length)];
        $scope.changeBg(item.image);
      });
    };

    // Find existing Special
    $scope.findOne = function () {
      $scope.special = Specials.get({
        specialId: $stateParams.specialId
      }, function(data) {
        $scope.changeBg(data.image);
      });
      $scope.episodes = Episodes.query({
        specialId: $stateParams.specialId,
        limit: 10
      });
    };
  }
]);

