'use strict';
/**
 * Created by stevenbarnhurst on 11/2/15.
 * TODO: Add a buffering icon to the play/pause button cycle
 */

angular.module('core').directive('audioPlayer', function ($rootScope, $document) {
  return {
    restrict: 'E',
    scope: {},
    link: function ($scope, $element) {
      var radio = $document[0].createElement('audio');
      console.log(radio);
      radio.src = 'http://seoulcommunityradio.out.airtime.pro:8000/seoulcommunityradio_a?1466567397161.mp3';
      var player = {};
      player.isPlaying = false;

      player.volumeChange = function (volume) {
        radio.volume = volume / 100.0;
      };

      player.playPause = function () {
        if (player.isPlaying) {
          radio.pause();
          player.isPlaying = false;
        } else {
          radio.play();
          player.isPlaying = true;
          $rootScope.$broadcast('audio.play', this);
        }
      };

      // Pause HTML audio on the instantiation of a player
      $scope.$on('player.play', function () {
        radio.pause();
      });
      $scope.player = player;
    },
    templateUrl: 'modules/core/client/views/components/audio-player.html'
  };
});
