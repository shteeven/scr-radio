'use strict';

// Setting up route
angular.module('things').config(['$stateProvider',
  function ($stateProvider) {
    // Things state routing
    $stateProvider
      .state('things', {
        abstract: true,
        url: '/things',
        template: '<div class="view"><ui-view/></div>'
      })
      .state('things.list', {
        url: '',
        templateUrl: 'modules/things/client/views/list-things.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      //.state('things.guests', {
      //  url: '/guests',
      //  templateUrl: 'modules/things/client/views/list-things.client.view.html'
      //})
      .state('things.create', {
        url: '/create',
        templateUrl: 'modules/things/client/views/create-thing.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('things.view', {
        url: '/:thingId',
        templateUrl: 'modules/things/client/views/view-thing.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('things.edit', {
        url: '/:thingId/edit',
        templateUrl: 'modules/things/client/views/edit-thing.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      });
  }
]);
