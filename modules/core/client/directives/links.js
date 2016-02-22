'use strict';
/**
 * Created by stevenbarnhurst on 1/22/16.
 * Purpose: Directive will list all social links available for any models passed to it.
 */

var app = angular.module('core');

app.directive('scrLinks', function($http, $rootScope, $sce) {
  return {
    restrict: 'E',
    scope: {
      data: '='
    },
    controller: function($scope, $element) {
      //init state
      $scope.links = {
        facebook: 'https://www.facebook.com/shteeven',
        twitter: 'https://about.twitter.com/?utm_source=google&utm_medium=cpc&utm_campaign=PFX_SEM_GW_US_EVERGREEN_TIER%201_EXACT_LPTESTABOUT&utm_content=Twitter&utm_term=twitter&gclid=CjwKEAiAgKu2BRDu1OGw3-KXokwSJAB_Yy2QotutFQSUIwmfVBG89i16JZMaDpiV6M6hgN0EKYpsihoC4P7w_wcB&gclsrc=aw.ds',
        homepage: 'https://www.facebook.com/shteeven',
        mixcloud: 'https://www.facebook.com/shteeven'
      };


    },
    templateUrl: 'modules/core/client/views/components/links.html'
  };
});