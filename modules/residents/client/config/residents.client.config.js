'use strict';

// Configuring the Residents module
angular.module('residents').run(['Menus',
  function (Menus) {
    // Add the residents dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Residents',
      state: 'residents',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'residents', {
      title: 'Residents',
      state: 'residents.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'residents', {
      title: 'Create Residents',
      state: 'residents.create',
      roles: ['user']
    });
    //
    //
    //// Add the dropdown list item
    //Menus.addSubMenuItem('topbar', 'residents', {
    //  title: 'Residents',
    //  state: 'residents.guests'
    //});

  }
]);
