'use strict';

// Setting up route
angular.module('residents').config(['$stateProvider',
  function ($stateProvider) {
    // Residents state routing
    $stateProvider
      .state('residents', {
        abstract: true,
        url: '/residents',
        template: '<div class="view"><ui-view/></div>'
      })
      .state('residents.list', {
        url: '',
        templateUrl: 'modules/residents/client/views/list-residents.client.view.html'
      })
      //.state('residents.guests', {
      //  url: '/guests',
      //  templateUrl: 'modules/residents/client/views/list-residents.client.view.html'
      //})
      .state('residents.create', {
        url: '/create',
        templateUrl: 'modules/residents/client/views/create-dj.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('residents.view', {
        url: '/:djId',
        templateUrl: 'modules/residents/client/views/view-dj.client.view.html'
      })
      .state('residents.edit', {
        url: '/:djId/edit',
        templateUrl: 'modules/residents/client/views/edit-dj.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      });
  }
]);
