'use strict';

// Setting up route
angular.module('djs').config(['$stateProvider',
  function ($stateProvider) {
    // Djs state routing
    $stateProvider
      .state('djs', {
        abstract: true,
        url: '/djs',
        template: '<div class="view bg bg-1"><ui-view/></div>'
      })
      .state('djs.list', {
        url: '',
        templateUrl: 'modules/djs/client/views/list-djs.client.view.html'
      })
      //.state('djs.guests', {
      //  url: '/guests',
      //  templateUrl: 'modules/djs/client/views/list-djs.client.view.html'
      //})
      .state('djs.create', {
        url: '/create',
        templateUrl: 'modules/djs/client/views/create-dj.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('djs.view', {
        url: '/:djId',
        templateUrl: 'modules/djs/client/views/view-dj.client.view.html'
      })
      .state('djs.edit', {
        url: '/:djId/edit',
        templateUrl: 'modules/djs/client/views/edit-dj.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      });
  }
]);
