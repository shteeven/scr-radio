'use strict';

// Setting up route
angular.module('specials').config(['$stateProvider',
  function ($stateProvider) {
    // Specials state routing
    $stateProvider
      .state('specials', {
        abstract: true,
        url: '/specials',
        template: '<div class="view"><ui-view/></div>'
      })
      .state('specials.list', {
        url: '',
        templateUrl: 'modules/specials/client/views/list-specials.client.view.html'
      })
      .state('specials.create', {
        url: '/create',
        templateUrl: 'modules/specials/client/views/create-special.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('specials.view', {
        url: '/:specialId',
        templateUrl: 'modules/specials/client/views/view-special.client.view.html'
      })
      .state('specials.edit', {
        url: '/:specialId/edit',
        templateUrl: 'modules/specials/client/views/edit-special.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      });
  }
]);
