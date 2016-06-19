'use strict';

// Configuring the Contents module
angular.module('contents').run(['Menus',
  function (Menus) {
    // Add the contents dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Contents',
      state: 'contents',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'contents', {
      title: 'Contents',
      state: 'contents.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'contents', {
      title: 'Create Contents',
      state: 'contents.create',
      roles: ['user']
    });
  }
]);
