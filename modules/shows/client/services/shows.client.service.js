'use strict';

//Shows service used for communicating with the shows REST endpoints
angular.module('shows').factory('Shows', ['$resource',
  function ($resource) {
    return $resource('api/shows/:showId', {
      showId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
