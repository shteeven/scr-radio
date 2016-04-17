'use strict';

// Setting up route
angular.module('regulars').config(['$stateProvider',
  function ($stateProvider) {
    // Regulars state routing
    $stateProvider
      .state('regulars', {
        abstract: true,
        url: '/regulars',
        template: '<div class="view"><ui-view/></div>'
      })
      .state('regulars.list', {
        url: '',
        templateUrl: 'modules/regulars/client/views/list-regulars.client.view.html'
      })
      //.state('regulars.guests', {
      //  url: '/guests',
      //  templateUrl: 'modules/regulars/client/views/list-regulars.client.view.html'
      //})
      .state('regulars.create', {
        url: '/create',
        templateUrl: 'modules/regulars/client/views/create-regular.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('regulars.view', {
        url: '/:regularId',
        templateUrl: 'modules/regulars/client/views/view-regular.client.view.html'
      })
      .state('regulars.edit', {
        url: '/:regularId/edit',
        templateUrl: 'modules/regulars/client/views/edit-regular.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      });
  }
]);
