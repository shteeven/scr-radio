'use strict';
/**
 * Created by stevenbarnhurst on 11/3/15.
 */
var app = angular.module('core');

app.directive('scrCarousel', function($rootScope, $http, $interval, $state) {
  return {
    restrict: 'E',
    scope: {
      slides: '='
    },
    controller: function($scope, $element) {
      
      $scope.currentIndex = 0;

      $scope.go = function (slide) {
        if (slide._id === "576b22cf2c06f24eb4f3eea0") {
          $state.go('contents.livestream');
        } else {
          $state.go('contents.view', { contentId: slide._id });
        }

      };

      var rotationDelay = 6800;

      $scope.isCurrentSlideIndex = function (index) {
        return $scope.currentIndex === index;
      };
      $scope.direction = 'slide-right';
      $scope.next = function() {
        $scope.direction = 'slide-left';
        $scope.currentIndex = ($scope.currentIndex > 0) ? --$scope.currentIndex : $scope.slides.length - 1;
      };
      $scope.previous = function() {
        $scope.direction = 'slide-right';
        $scope.currentIndex = ($scope.currentIndex < $scope.slides.length - 1) ? ++$scope.currentIndex : 0;
      };

      // Set slides to auto rotate
      // initialize rotation
      var rotateSlide = $interval(function(){$scope.next();}, rotationDelay);

      $scope.startRotation = function(){
        if(rotateSlide) {
          $interval.cancel(rotateSlide);
          rotateSlide = undefined;
        }
        rotateSlide = $interval(function(){$scope.next();}, rotationDelay);
      };
      $scope.stopRotation = function(){
        if(rotateSlide) {
          $interval.cancel(rotateSlide);
          rotateSlide = undefined;
        }
      };

      //destroy interval on page change
      $scope.$on('$destroy',function(){
        if (rotateSlide){
          $interval.cancel(rotateSlide);
          rotateSlide = undefined;
        }
      });


    },

    templateUrl: 'modules/core/client/views/components/carousel.html'
  };
});

