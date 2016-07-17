'use strict';
/**
 * Created by stevenbarnhurst on 1/22/16.
 */

var app = angular.module('core');

app.directive('mcWidget', function($http, $rootScope, $sce) {
  return {
    restrict: 'E',
    scope: {
      data: '='
    },
    controller: function($scope, $element) {
      //init state
      $scope.widgetOpen = false;

      $scope.close = function() {
        $scope.widgetOpen = false;
      };

      // When a episode element is clicked, it triggers this.
      $rootScope.$on('player.play', function (event, args){
        console.log('what');
        var new_track = $sce.trustAsResourceUrl('https://www.mixcloud.com/widget/iframe/?feed=' + args.url + '&hide_cover=1&mini=1&autoplay=1');
        if (new_track !== $scope.current_mc_track) {
          $scope.close();
          $scope.current_mc_track = new_track;
        }
        // URL is not safe according to angular
        $scope.widgetOpen = true;
      });

      // turns off mc widget when other audio element is played
      $rootScope.$on('audio.play', function (){
        $scope.widgetOpen = false;
      });

    },
    templateUrl: 'modules/core/client/views/components/mcwidget.html'
  };
});