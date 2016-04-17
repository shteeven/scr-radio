'use strict';

// Configuring the Regulars module
angular.module('regulars').run(['Menus',
  function (Menus) {
    // Add the regulars dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Regulars',
      state: 'regulars',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'regulars', {
      title: 'Regulars',
      state: 'regulars.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'regulars', {
      title: 'Create Regulars',
      state: 'regulars.create',
      roles: ['user']
    });
    //
    //
    //// Add the dropdown list item
    //Menus.addSubMenuItem('topbar', 'regulars', {
    //  title: 'Regulars',
    //  state: 'regulars.guests'
    //});

  }
]);
