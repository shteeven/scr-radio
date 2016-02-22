'use strict';

//Stars service used for communicating with the stars REST endpoints
angular.module('stars').factory('Stars', ['$resource',
  function ($resource) {
    return $resource('api/stars/:starId', {
      starId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
