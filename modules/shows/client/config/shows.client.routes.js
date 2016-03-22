'use strict';

// Setting up route
angular.module('shows').config(['$stateProvider',
  function ($stateProvider) {
    // Shows state routing
    $stateProvider
      .state('shows', {
        abstract: true,
        url: '/shows',
        template: '<div class="view"><ui-view/></div>'
      })
      .state('shows.list', {
        url: '',
        templateUrl: 'modules/shows/client/views/list-shows.client.view.html'
      })
      .state('shows.create', {
        url: '/create',
        templateUrl: 'modules/shows/client/views/create-show.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('shows.view', {
        url: '/:showId',
        templateUrl: 'modules/shows/client/views/view-show.client.view.html'
      })
      .state('shows.edit', {
        url: '/:showId/edit',
        templateUrl: 'modules/shows/client/views/edit-show.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      });
  }
]);
