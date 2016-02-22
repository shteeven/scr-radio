'use strict';
/**
 * Created by stevenbarnhurst on 11/3/15.
 */
var app = angular.module('core');

app.directive('scrTiles', function($rootScope, $http) {
  return {
    restrict: 'EA',
    scope: {
      limit: '@',
      data: '='
    },
    controller: function($scope, $element) {
      $http.get('modules/core/client/data/mixcloud-shows.json').then(
        function(data){
          $scope.tiles = data.data;
        }
      );

      $scope.playPlayer = function(track) {
        $rootScope.$broadcast('player.play', { track: track });
      };
    },
    templateUrl: 'modules/core/client/views/components/tiles.html'
  };
});
