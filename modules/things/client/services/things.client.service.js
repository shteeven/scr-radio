'use strict';

//Things service used for communicating with the things REST endpoints
angular.module('things').factory('Things', ['$resource',
  function ($resource) {
    return $resource('api/things/:thingId', {
      thingId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
