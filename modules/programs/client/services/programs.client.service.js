'use strict';

//Programs service used for communicating with the programs REST endpoints
angular.module('programs').factory('Programs', ['$resource',
  function ($resource) {
    return $resource('api/programs/:programId', {
      programId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
