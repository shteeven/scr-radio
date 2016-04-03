'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'Episodes', 'Programs', 'Residents', '$http',
  function ($scope, Authentication, Episodes, Programs, Residents, $http) {
    // This provides Authentication context.
    $scope.authentication = Authentication;
    $scope.tile_limit = 3;

    $scope.episode_tiles = Episodes.query();
    $scope.program_tiles = Programs.query();
    $scope.resident_tiles = Residents.query();

    $http.get('api/getfeatured').then(function(data) {
      console.log(data);
    });
  }
]);
