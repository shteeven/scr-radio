'use strict';
/**
 * Created by stevenbarnhurst on 11/3/15.
 * Info: This directive has three items in a closed scope that can be used to pass information into it.
 * limit: tells directive the max number of tiles to display;
 * tiles: an array of objects used to populate the tiles;
 * template: an keyword that tells the directive what template to use as well as the parent class for styling with individual modules; styles for this class should be placed in the module that this directive will be placed.
 */
var app = angular.module('core');

app.directive('scrTiles', function($rootScope, $http) {
  return {
    restrict: 'EA',
    scope: {
      limit: '@',
      tiles: '=',
      template: '@'
    },
    controller: function($scope, $element) {
      $scope.playPlayer = function(url) {
        $rootScope.$broadcast('player.play', { url: url });
      };
      $scope.template = $scope.template || 'home';

      $scope.rowLength = 5;
      
      $scope.placeholder = 'modules/core/client/img/resources/placeholder-square.png';

      $scope.contentUrl = 'modules/core/client/views/components/tiles-' + $scope.template + '.html';
    },
    template: '<div ng-include="contentUrl" ng-class="[template]"></div>'
  };
});
