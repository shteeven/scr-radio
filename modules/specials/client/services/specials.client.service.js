'use strict';

//Specials service used for communicating with the specials REST endpoints
angular.module('specials').factory('Specials', ['$resource',
  function ($resource) {
    return $resource('api/specials/:specialId', {
      specialId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
