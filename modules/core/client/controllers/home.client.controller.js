'use strict';

//noinspection JSAnnotator
angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'Contents',
  function ($scope, Authentication, Contents) {
    // This provides Authentication context.
    $scope.authentication = Authentication;
    $scope.tile_limit = 12;


    $scope.tiles = Contents.query({ featured: 'tiles' }, function (data) {
      console.log(data);
    });

    $scope.slides = Contents.query({ featured: 'carousel' });

  }
]);
