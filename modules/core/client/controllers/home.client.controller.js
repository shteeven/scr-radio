'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'Shows', 'Programs', 'Djs', '$http',
  function ($scope, Authentication, Shows, Programs, Djs, $http) {
    // This provides Authentication context.
    $scope.authentication = Authentication;
    $scope.tile_limit = 3;

    $scope.show_tiles = Shows.query();
    $scope.program_tiles = Programs.query();
    $scope.dj_tiles = Djs.query();

    $http.get('api/getfeatured').then(function(data) {
      console.log(data);
    });
  }
]);
