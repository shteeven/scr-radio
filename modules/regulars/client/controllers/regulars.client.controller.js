'use strict';

// Regulars controller
angular.module('regulars').controller('RegularsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Regulars', 'Specials', 'Episodes',
  function ($scope, $stateParams, $location, Authentication, Regulars, Specials, Episodes) {
    $scope.authentication = Authentication;



    // Clear forms
    $scope.clear = function(){
      $scope.regular.title = '';
      $scope.regular.image = '';
      $scope.regular.images = [];
      $scope.regular.links = {};
      $scope.regular.categories = [];
      $scope.regular.description = {};
      $scope.regular.guest = false;
      $scope.regular.featured = false;
    };

    // Create new Regular
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'regularForm');

        return false;
      }

      // Create new Regular object
      var regular = new Regulars({
        title: $scope.regular.title,
        image: $scope.regular.image,
        images: $scope.regular.images,
        links: $scope.regular.links,
        categories: $scope.regular.categories,
        description: $scope.regular.description,
        guest: $scope.regular.guest,
        featured: $scope.regular.featured
      });

      // Redirect after save
      regular.$save(function (response) {

        $location.path('regulars/' + response._id);

        // Clear form fields
        $scope.clear();

      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Regular
    $scope.remove = function (regular) {
      if (regular) {
        regular.$remove();

        for (var i in $scope.regulars) {
          if ($scope.regulars[i] === regular) {
            $scope.regulars.splice(i, 1);
          }
        }
      } else {
        $scope.regular.$remove(function () {
          $location.path('regulars');
        });
      }
    };

    // Update existing Regular
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'regularForm');

        return false;
      }

      var regular = $scope.regular;

      regular.$update(function () {

        $location.path('regulars/' + regular._id);

      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Regulars
    $scope.find = function () {
      $scope.regulars = Regulars.query({}, function (data) {
        var item = data[Math.floor(Math.random()*data.length)];
        $scope.changeBg(item.image);
      });
    };

    // Find existing Regular
    // TODO: this is a bit ridiculous
    $scope.findOne = function () {
      $scope.regular = Regulars.get({
        regularId: $stateParams.regularId
      }, function(data) {
        $scope.changeBg(data.image);
      });
      $scope.specials = Specials.query({
        regularId: $stateParams.regularId,
        limit: 5
      });
      $scope.episodes = Episodes.query({
        regularId: $stateParams.regularId,
        limit: 10
      });

    };

  }
]);
