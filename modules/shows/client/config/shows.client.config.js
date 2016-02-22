'use strict';

// Configuring the Shows module
angular.module('shows').run(['Menus',
  function (Menus) {
    // Add the shows dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Shows',
      state: 'shows',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'shows', {
      title: 'List Shows',
      state: 'shows.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'shows', {
      title: 'Create Shows',
      state: 'shows.create',
      roles: ['user']
    });
  }
]);
