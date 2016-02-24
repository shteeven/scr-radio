'use strict';

// Configuring the Programs module
angular.module('programs').run(['Menus',
  function (Menus) {
    // Add the programs dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Programs',
      state: 'programs',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'programs', {
      title: 'List Programs',
      state: 'programs.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'programs', {
      title: 'Create Programs',
      state: 'programs.create',
      roles: ['user']
    });
  }
]);
