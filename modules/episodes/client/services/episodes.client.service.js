'use strict';

//Episodes service used for communicating with the episodes REST endpoints
angular.module('episodes').factory('Episodes', ['$resource',
  function ($resource) {
    return $resource('api/episodes/:episodeId', {
      episodeId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
