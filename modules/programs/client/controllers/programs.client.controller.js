'use strict';

// Programs controller
angular.module('programs').controller('ProgramsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Programs', 'Residents', 'Episodes',
  function ($scope, $stateParams, $location, Authentication, Programs, Residents, Episodes) {
    $scope.authentication = Authentication;
    $scope.program = {};
    $scope.program.residents = [];

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
    $scope.getResidents = function() {
      $scope.residents = Residents.query();
    };

    // Insert RESIDENT into the RESIDENTs list
    // resident arg is a RESIDENT's _id
    $scope.addResident = function(title) { // use of title instead of id is due to the object being passed as a string literal
      var resident = $scope.residents.filter(function(resident) {
        return resident.title === title;
      })[0];
      if ($scope.program.residents.indexOf(resident) < 0) { $scope.program.residents.push(resident); }
    };
    $scope.removeResident = function(resident) {
      $scope.program.residents = $scope.program.residents.filter(function (obj) { return obj !== resident; });
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
      $scope.program.residents = [];
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
        residents: $scope.program.residents,
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
      $scope.episodes = Episodes.query({
        programId: $stateParams.programId,
        limit: 10
      });
    };
  }
]);

