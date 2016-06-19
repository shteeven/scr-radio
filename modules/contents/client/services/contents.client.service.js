'use strict';

//Contents service used for communicating with the contents REST endpoints
angular.module('contents').factory('Contents', ['$resource',
  function ($resource) {
    return $resource('api/contents/:contentId', {
      contentId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
