'use strict';

// Configuring the Things module
angular.module('things').run(['Menus',
  function (Menus) {
    // Add the things dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Things',
      state: 'things',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'things', {
      title: 'Things',
      state: 'things.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'things', {
      title: 'Create Things',
      state: 'things.create',
      roles: ['user']
    });

  }
]);
