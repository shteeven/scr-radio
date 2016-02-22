'use strict';

// Setting up route
angular.module('stars').config(['$stateProvider',
  function ($stateProvider) {
    // Stars state routing
    $stateProvider
      .state('stars', {
        abstract: true,
        url: '/stars',
        template: '<ui-view/>'
      })
      .state('stars.list', {
        url: '',
        templateUrl: 'modules/stars/client/views/list-stars.client.view.html'
      })
      .state('stars.create', {
        url: '/create',
        templateUrl: 'modules/stars/client/views/create-star.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('stars.view', {
        url: '/:starId',
        templateUrl: 'modules/stars/client/views/view-star.client.view.html'
      })
      .state('stars.edit', {
        url: '/:starId/edit',
        templateUrl: 'modules/stars/client/views/edit-star.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      });
  }
]);
