'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'Episodes', 'Specials', 'Regulars', '$http',
  function ($scope, Authentication, Episodes, Specials, Regulars, $http) {
    // This provides Authentication context.
    $scope.authentication = Authentication;
    $scope.tile_limit = 9;

    $scope.episode_tiles = Episodes.query();
    $scope.special_tiles = Specials.query();
    $scope.regular_tiles = Regulars.query();

    $http.get('api/getfeatured').then(function(data) {
      console.log(data);
    });
  }
]);
