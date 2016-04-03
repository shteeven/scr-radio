'use strict';

// Setting up route
angular.module('episodes').config(['$stateProvider',
  function ($stateProvider) {
    // Episodes state routing
    $stateProvider
      .state('episodes', {
        abstract: true,
        url: '/episodes',
        template: '<div class="view"><ui-view/></div>'
      })
      .state('episodes.list', {
        url: '',
        templateUrl: 'modules/episodes/client/views/list-episodes.client.view.html'
      })
      .state('episodes.create', {
        url: '/create',
        templateUrl: 'modules/episodes/client/views/create-episode.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('episodes.view', {
        url: '/:episodeId',
        templateUrl: 'modules/episodes/client/views/view-episode.client.view.html'
      })
      .state('episodes.edit', {
        url: '/:episodeId/edit',
        templateUrl: 'modules/episodes/client/views/edit-episode.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      });
  }
]);
