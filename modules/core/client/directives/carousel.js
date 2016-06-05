'use strict';
/**
 * Created by stevenbarnhurst on 11/3/15.
 */
var app = angular.module('core');

app.directive('scrCarousel', function($rootScope, $http, $interval, Things) {
  return {
    restrict: 'E',
    scope: {},
    controller: function($scope, $element) {
      $scope.slides = Things.query({ category: 'carousel' });

      $scope.currentIndex = 0;

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
      var rotateSlide = $interval(function(){$scope.next();}, 6800);

      $scope.startRotation = function(){
        if(rotateSlide) {
          $interval.cancel(rotateSlide);
          rotateSlide = undefined;
        }
        rotateSlide = $interval(function(){$scope.next();}, 6800);
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

