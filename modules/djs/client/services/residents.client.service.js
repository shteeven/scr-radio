'use strict';

//Residents service used for communicating with the residents REST endpoints
angular.module('residents').factory('Residents', ['$resource',
  function ($resource) {
    return $resource('api/residents/:djId', {
      djId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
