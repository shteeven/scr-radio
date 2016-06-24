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
      state: 'contents.list({contentType: null})',
      roles: ['user']
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'contents', {
      title: 'Create Contents',
      state: 'contents.create',
      roles: ['user']
    });

    Menus.addSubMenuItem('topbar', 'contents', {
      title: 'Live Video Stream',
      state: 'contents.livestream'
    });

    Menus.addSubMenuItem('topbar', 'contents', {
      title: 'Regulars',
      state: 'contents.list({contentType: "regular"})'
    });

    Menus.addSubMenuItem('topbar', 'contents', {
      title: 'Specials',
      state: 'contents.list({contentType: "special"})'
    });

    Menus.addSubMenuItem('topbar', 'contents', {
      title: 'Episodes',
      state: 'contents.list({contentType: "episode"})'
    });

    Menus.addSubMenuItem('topbar', 'contents', {
      title: 'Events',
      state: 'contents.list({contentType: "event"})'
    });


  }
]);
