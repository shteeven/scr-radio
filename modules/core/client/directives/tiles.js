'use strict';
//noinspection JSAnnotator
/**
 * Created by stevenbarnhurst on 11/3/15.
 * Info: This directive has three items in a closed scope that can be used to pass information into it.
 * limit: tells directive the max number of tiles to display;
 * tiles: an array of objects used to populate the tiles;
 * template: an keyword that tells the directive what template to use as well as the parent class for styling with individual modules; styles for this class should be placed in the module that this directive will be placed.
 */
var app = angular.module('core');

app.directive('scrTiles', function($rootScope, $state) {
  return {
    restrict: 'EA',
    scope: {
      limit: '@',
      tiles: '=',
      rowLength: '=',
      template: '@'
    },
    controller: function($scope, $element) {
      $scope.playPlayer = function(url) {
        console.log('here');
        $rootScope.$broadcast('player.play', { url: url });
      };
      $scope.template = 'home';
      $scope.rowLengthSmall = 2;

      $scope.go = function (tile) {
        $state.go('contents.view', { contentId: tile._id });
      };
      
      $scope.placeholder = 'modules/core/client/img/resources/placeholder-square.png';

      $scope.contentUrl = 'modules/core/client/views/components/tiles-' + $scope.template + '.html';
    },
    template: '<div ng-include="contentUrl" ng-class="[template]"></div>'
  };
});
