'use strict';

//Djs service used for communicating with the djs REST endpoints
angular.module('djs').factory('Djs', ['$resource',
  function ($resource) {
    return $resource('api/djs/:djId', {
      djId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
