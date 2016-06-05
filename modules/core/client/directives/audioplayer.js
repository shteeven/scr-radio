'use strict';
/**
 * Created by stevenbarnhurst on 11/2/15.
 * TODO: Add a buffering icon to the play/pause button cycle
 */

angular.module('core').directive('audioPlayer', function($rootScope) {
  return {
    restrict: 'E',
    scope: {},
    link: function($scope, $element) {
      
      var radio = document.getElementById('radio');
      $scope.isPlaying = false;

      $scope.playPause = function () {
        if (!$scope.isPlaying) {
          radio.pause();
          $scope.isPlaying = true;
        } else {
          radio.play();
          $scope.isPlaying = false;
          $rootScope.$broadcast('audio.play', this);
        }
      };

      // Pause HTML audio on the instantiation of a player
      $scope.$on('player.play', function (){
        radio.pause();
      });
    },
    templateUrl: 'modules/core/client/views/components/audio-player.html'
  };
});


// tell audio element to play/pause, you can also use $scope.audio.play() or $scope.audio.pause();
//$scope.playpause = function(){ var a = $scope.audio.paused ? $scope.audio.play() : $scope.audio.pause(); };

// listen for audio-element events, and broadcast stuff
//$scope.audio.addEventListener('play', function(){ $rootScope.$broadcast('audio.play', this); });
//$scope.audio.addEventListener('pause', function(){ $rootScope.$broadcast('audio.pause', this); });


//$scope.audio.addEventListener('timeupdate', function(){ $rootScope.$broadcast('audio.time', this); });
//$scope.audio.addEventListener('ended', function(){ $rootScope.$broadcast('audio.ended', this); $scope.next(); });

// set track & play it
//$rootScope.$on('audio.set', function(r, file, info, currentNum, totalNum){
//  var playing = !$scope.audio.paused;
//  $scope.audio.src = file;
//  var a = playing ? $scope.audio.play() : $scope.audio.pause();
//  $scope.info = info;
//  $scope.currentNum = currentNum;
//  $scope.totalNum = totalNum;
//});

// update display of things - makes time-scrub work
//setInterval(function(){ $scope.$apply(); }, 500);

//console.log($scope.radio);
// tell others to give me my prev/next track (with audio.set message)
//$scope.next = function(){ $rootScope.$broadcast('audio.next'); };
//$scope.prev = function(){ $rootScope.$broadcast('audio.prev'); };

//$scope.currentNum = 0;

//function init() {
//  $rootScope.$broadcast('audio.set', 'http://streaming.radio.co/s8ca94767c/listen');
//}
//init();
