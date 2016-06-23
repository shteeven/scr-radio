'use strict';

// Setting up route
angular.module('contents').config(['$stateProvider',
  function ($stateProvider) {
    // Contents state routing
    $stateProvider
      .state('contents', {
        abstract: true,
        url: '/contents',
        template: '<div class="view"><ui-view/></div>'
      })
      .state('contents.list', { // make the edits here
        url: '/type/:contentType',
        templateUrl: 'modules/contents/client/views/list-contents.client.view.html'
      })
      .state('contents.create', {
        url: '/create',
        templateUrl: 'modules/contents/client/views/create-content.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('contents.edit', {
        url: '/:contentId/edit',
        templateUrl: 'modules/contents/client/views/edit-content.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('contents.view', {
        url: '/:contentId',
        templateUrl: 'modules/contents/client/views/view-content.client.view.html'
      })
      
      .state('contents.livestream', {
        url: '/pages/livestream',
        templateUrl: 'modules/contents/client/views/livestream.client.view.html'
      });
      
  }
]);
