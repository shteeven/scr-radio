'use strict';
//noinspection JSAnnotator
/**
 * Created by stevenbarnhurst on 11/2/15.
 * TODO: Add a buffering icon to the play/pause button cycle
 */

angular.module('core').directive('audioPlayer', function ($rootScope, $document, $timeout, $http) {
  return {
    restrict: 'E',
    scope: {},
    link: function ($scope, $element) {
      // for metadata
      var timeout;
      var timer = 50;
      var timeNow;
      var timeEnd;
      var diffMs;

      var radio = $document[0].createElement('audio');
      radio.src = 'http://seoulcommunityradio.out.airtime.pro:8000/seoulcommunityradio_a?1466567397161.mp3';
      var player = {};
      player.isPlaying = false;

      function getMetadata() {
        $http.jsonp("https://seoulcommunityradio.airtime.pro/api/live-info-v2", {
          // headers: {'content-type': 'application/json'},
          params: {
            format: 'jsonp',
            callback: 'JSON_CALLBACK'
          }
        }).then(
          function (data) {
            data = data.data;
            console.log(data.tracks);
            if ($scope.metadata && data.tracks && data.tracks.current && data.tracks.current.name === $scope.metadata.tracks.current.name) { // try again in ten
              timer = 10000; // check in 10 seconds
              setTimer(timer); // start new timeout
            } else {
              $scope.metadata = data; // set metadata
              timeNow = new Date(data.station.schedulerTime);
              var endDateTime = data.tracks.next ? data.tracks.next.starts : data.tracks.current.ends;
              timeEnd = new Date(endDateTime);
              timer = timeEnd.getTime() - timeNow.getTime() + 100;
              setTimer(timer);  // create new timeout based on metadata
            }
          }, function (err) {
            console.log(err);
          }
        );
      }

      function setTimer(interval) {
        $timeout.cancel(timeout);
        timeout = $timeout(function() {
          getMetadata();
        }, interval);
      }

      player.volumeChange = function (direction) {
        if (radio.volume !== 1.0 && direction === 'up') {
          radio.volume = radio.volume+0.1;
          $scope.opacityPlus = {opacity: 1-(radio.volume*0.6)};
          $scope.opacityMinus = {opacity: 0.4+(radio.volume*0.6)};
        } else if (radio.volume !== 0.0) {
          radio.volume = radio.volume-0.1;
          $scope.opacityPlus = {opacity: 1-(radio.volume*0.6)};
          $scope.opacityMinus = {opacity: 0.4+(radio.volume*0.6)};
        }
        if (radio.volume >= 0.999) {
          $scope.atMax = true;
          radio.volume = 1;
        } else if (radio.volume <= 0.001) {
          $scope.atMin = true;
          radio.volume = 0;
        } else {
          $scope.atMax = false;
          $scope.atMin = false;
        }
      };

      player.playPause = function () {
        if (player.isPlaying) {
          radio.pause();
          $timeout.cancel(timeout);
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
      radio.volume = 0.5;
      $scope.opacityPlus = {opacity: 1-(radio.volume*0.6)};
      $scope.opacityMinus = {opacity: 0.4+(radio.volume*0.6)};

      setTimer(10);
    },
    templateUrl: 'modules/core/client/views/components/audio-player.html'
  };
});
