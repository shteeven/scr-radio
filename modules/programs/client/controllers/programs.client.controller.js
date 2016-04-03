'use strict';

// Programs controller
angular.module('programs').controller('ProgramsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Programs', 'Djs',
  function ($scope, $stateParams, $location, Authentication, Programs, Djs) {
    $scope.authentication = Authentication;
    $scope.program = {};
    $scope.program.djs = [];

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
    // dj arg is a DJ's _id
    $scope.addDj = function(title) { // use of title instead of id is due to the object being passed as a string literal
      var dj = $scope.djs.filter(function(dj) {
        return dj.title === title;
      })[0];
      if ($scope.program.djs.indexOf(dj) < 0) { $scope.program.djs.push(dj); }
    };
    $scope.removeDj = function(dj) {
      $scope.program.djs = $scope.program.djs.filter(function (obj) { return obj !== dj; });
    };

    // Clear forms
    $scope.clear = function(){
      $scope.program = {};
      $scope.program.title = '';
      $scope.program.image = '';
      $scope.program.images = [];
      $scope.program.links = {};
      $scope.program.categories = [];
      $scope.program.description = {};
      $scope.program.djs = [];
      $scope.program.schedule = {};
      $scope.program.featured = false;
    };

    // Create new Program
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'programForm');

        return false;
      }

      // Create new Program object
      var program = new Programs({
        title: $scope.program.title,
        image: $scope.program.image,
        images: $scope.program.images,
        links: $scope.program.links,
        categories: $scope.program.categories,
        description: $scope.program.description,
        djs: $scope.program.djs,
        schedule: $scope.program.schedule,
        featured: $scope.program.featured
      });

      // Redirect after save
      program.$save(function (response) {

        $location.path('programs/' + response._id);

        // Clear form fields
        $scope.clear();

      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Program
    $scope.remove = function (program) {
      if (program) {
        program.$remove();

        for (var i in $scope.programs) {
          if ($scope.programs[i] === program) {
            $scope.programs.splice(i, 1);
          }
        }
      } else {
        $scope.program.$remove(function () {
          $location.path('programs');
        });
      }
    };

    // Update existing Program
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'programForm');

        return false;
      }

      var program = $scope.program;

      program.$update(function () {

        $location.path('programs/' + program._id);

      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Programs
    $scope.find = function () {
      $scope.programs = Programs.query({}, function (data) {
        var item = data[Math.floor(Math.random()*data.length)];
        $scope.changeBg(item.image);
      });
    };

    // Find existing Program
    $scope.findOne = function () {
      $scope.program = Programs.get({
        programId: $stateParams.programId
      }, function(data) {
        $scope.changeBg(data.image);
      });
    };
  }
]);
