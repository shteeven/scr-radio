'use strict';
//noinspection JSAnnotator
/**
 * Created by stevenbarnhurst on 1/22/16.
 * Purpose: Directive will list all social links available for any models passed to it.
 */

var app = angular.module('core');

app.directive('scrLinks', function($http, $rootScope, $sce) {
  return {
    restrict: 'E',
    scope: {
      links: '='
    },
    controller: function($scope, $element) {
      $scope.isOpen = false;

    },
    templateUrl: 'modules/core/client/views/components/links.html'
  };
});