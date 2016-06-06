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
      // var radio = document.getElementById('radio');
      var radio = $document[0].createElement('audio');
      console.log(radio);
      radio.src = 'http://vpr.streamguys.net/vpr96.mp3';
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


//
// (function(window) {
//
//   var tunesApp = angular.module('tunesApp', []);
//
//   window.TunesCtrl = function($scope, $http, player) {
//     $scope.player = player;
//     $http.get('albums.json').success(function(data) {
//       $scope.albums = data;
//     });
//   };
//
//
//   tunesApp.factory('player', function(audio, $rootScope) {
//     var player,
//       playlist = [],
//       paused = false,
//       current = {
//         album: 0,
//         track: 0
//       };
//
//     player = {
//       playlist: playlist,
//
//       current: current,
//
//       playing: false,
//
//       play: function(track, album) {
//         if (!playlist.length) return;
//
//         if (angular.isDefined(track)) current.track = track;
//         if (angular.isDefined(album)) current.album = album;
//
//         if (!paused) audio.src = playlist[current.album].tracks[current.track].url;
//         audio.play();
//         player.playing = true;
//         paused = false;
//       },
//
//       pause: function() {
//         if (player.playing) {
//           audio.pause();
//           player.playing = false;
//           paused = true;
//         }
//       },
//
//       reset: function() {
//         player.pause();
//         current.album = 0;
//         current.track = 0;
//       },
//
//       next: function() {
//         if (!playlist.length) return;
//         paused = false;
//         if (playlist[current.album].tracks.length > (current.track + 1)) {
//           current.track++;
//         } else {
//           current.track = 0;
//           current.album = (current.album + 1) % playlist.length;
//         }
//         if (player.playing) player.play();
//       },
//
//       previous: function() {
//         if (!playlist.length) return;
//         paused = false;
//         if (current.track > 0) {
//           current.track--;
//         } else {
//           current.album = (current.album - 1 + playlist.length) % playlist.length;
//           current.track = playlist[current.album].tracks.length - 1;
//         }
//         if (player.playing) player.play();
//       }
//     };
//
//     playlist.add = function(album) {
//       if (playlist.indexOf(album) != -1) return;
//       playlist.push(album);
//     };
//
//     playlist.remove = function(album) {
//       var index = playlist.indexOf(album);
//       if (index == current.album) player.reset();
//       playlist.splice(index, 1);
//     };
//
//     audio.addEventListener('ended', function() {
//       $rootScope.$apply(player.next);
//     }, false);
//
//     return player;
//   });
//
//
//   // extract the audio for making the player easier to test
//   tunesApp.factory('audio', function($document) {
//     var audio = $document[0].createElement('audio');
//     return audio;
//   });
//
// })(window);
//


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
