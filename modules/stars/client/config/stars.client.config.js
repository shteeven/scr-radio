'use strict';

// Configuring the Stars module
angular.module('stars').run(['Menus',
  function (Menus) {
    // Add the stars dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Stars',
      state: 'stars',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'stars', {
      title: 'List Stars',
      state: 'stars.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'stars', {
      title: 'Create Stars',
      state: 'stars.create',
      roles: ['user']
    });
  }
]);
