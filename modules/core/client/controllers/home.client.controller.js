'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'Episodes', 'Specials', 'Regulars', 'Things', '$http',
  function ($scope, Authentication, Episodes, Specials, Regulars, Things, $http) {
    // This provides Authentication context.
    $scope.authentication = Authentication;
    $scope.tile_limit = 12;

    // $scope.episode_tiles = Episodes.query();
    // $scope.special_tiles = Specials.query();
    $scope.tiles = Things.query({category: 'tiles'}, function (data) {
      //console.log(data);
    });

    $scope.slides = Things.query({ category: 'carousel' });
    

    // $scope.tiles = Things.query({type: 'tiles'}, function (data) {
    //   console.log(data);
    // });

  }
]);
