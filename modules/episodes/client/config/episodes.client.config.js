'use strict';

// Configuring the Episodes module
angular.module('episodes').run(['Menus',
  function (Menus) {
    // Add the episodes dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Episodes',
      state: 'episodes',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'episodes', {
      title: 'Episodes',
      state: 'episodes.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'episodes', {
      title: 'Create Episodes',
      state: 'episodes.create',
      roles: ['user']
    });
  }
]);
