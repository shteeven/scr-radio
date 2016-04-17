'use strict';

//Regulars service used for communicating with the regulars REST endpoints
angular.module('regulars').factory('Regulars', ['$resource',
  function ($resource) {
    return $resource('api/regulars/:regularId', {
      regularId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
