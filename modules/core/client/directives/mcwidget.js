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
      $scope.widgetOpen = true;
      var mc_url = 'https://www.mixcloud.com/SCR_Radio/apachi-b2b-minii-alter-ego-show-recorded-live-at-pistil-05-02-2016/'
      $scope.current_mc_track = $sce.trustAsResourceUrl("https://www.mixcloud.com/widget/iframe/?feed=" + mc_url + "&hide_cover=1&mini=1&autoplay=1");

      $rootScope.$on('player.play', function (event, args){
        $scope.current_mc_track = args.track;
        $scope.widgetOpen = true;
      });
      $rootScope.$on('audio.play', function (){
        console.log('fired');
        $scope.widgetOpen = false;
      });

      $scope.uuid = '738a63b0-550a-413a-8b08-e856af972010';
    },
    templateUrl: 'modules/core/client/views/components/mcwidget.html'
  };
});