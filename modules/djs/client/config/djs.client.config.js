'use strict';

// Configuring the Djs module
angular.module('djs').run(['Menus',
  function (Menus) {
    // Add the djs dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Djs',
      state: 'djs',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'djs', {
      title: 'Residents',
      state: 'djs.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'djs', {
      title: 'Create Djs',
      state: 'djs.create',
      roles: ['user']
    });
    //
    //
    //// Add the dropdown list item
    //Menus.addSubMenuItem('topbar', 'djs', {
    //  title: 'Residents',
    //  state: 'djs.guests'
    //});

  }
]);
