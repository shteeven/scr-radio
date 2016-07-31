'use strict';

//noinspection JSAnnotator
angular.module('core').directive('scrHeader', function () {
  return {
    restrict: 'E',
    scope: {

    },
    templateUrl: 'modules/core/client/views/components/header.html',
    controllerAs: 'ctrl',
    controller: ['$rootScope', function ($rootScope) {
      var ctrl = this;

      //init state
      ctrl.main_links = {
        facebook: 'https://www.facebook.com/seoulcommunityradio/',
        twitter: 'https://twitter.com/radio_scr',
        mixcloud: 'https://www.mixcloud.com/SCR_Radio/',
        instagram: 'https://www.instagram.com/scr_radio/',
        soundcloud: 'https://soundcloud.com/seoulcommunityradio'
      };

      // Toggle the menu items
      ctrl.isCollapsed = false;
      ctrl.toggleCollapsibleMenu = function () {
        ctrl.isCollapsed = !ctrl.isCollapsed || false;
      };

      // Collapsing the menu after navigation
      $rootScope.$on('$stateChangeSuccess', function () {
        ctrl.isCollapsed = false;
      });
    }]
  };
});
