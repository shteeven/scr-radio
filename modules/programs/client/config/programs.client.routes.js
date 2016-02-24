'use strict';

// Setting up route
angular.module('programs').config(['$stateProvider',
  function ($stateProvider) {
    // Programs state routing
    $stateProvider
      .state('programs', {
        abstract: true,
        url: '/programs',
        template: '<div class="view bg bg-1"><ui-view/></div>'
      })
      .state('programs.list', {
        url: '',
        templateUrl: 'modules/programs/client/views/list-programs.client.view.html'
      })
      .state('programs.create', {
        url: '/create',
        templateUrl: 'modules/programs/client/views/create-program.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('programs.view', {
        url: '/:programId',
        templateUrl: 'modules/programs/client/views/view-program.client.view.html'
      })
      .state('programs.edit', {
        url: '/:programId/edit',
        templateUrl: 'modules/programs/client/views/edit-program.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      });
  }
]);
