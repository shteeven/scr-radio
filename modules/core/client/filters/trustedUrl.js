'use strict';
//noinspection JSAnnotator
/**
 * Returns filtered url as trusted resource
 */

angular.module('core').filter('trustUrl',['$sce', function($sce) {
  return function(url){
    return $sce.trustAsResourceUrl(url);
  };
}]);