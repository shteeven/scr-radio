'use strict';

angular.module('core').controller('SidenavController', ['$scope', '$state', 'Authentication', 'Menus', '$log',
  function ($scope, $state, Authentication, Menus, $log) {
    // Expose view variables
    $scope.$state = $state;
    $scope.authentication = Authentication;
    $scope.status = {
      isopen: false
    };

    //toggle side nav
    $scope.menu_toggled = false; // initialize toggle
    $scope.menuToggle = function() { $scope.menu_toggled = !$scope.menu_toggled; };

    //This is for the drop down menu
    $scope.menu_dropped = false;
    $scope.dropMenu = function() { $scope.menu_dropped = !$scope.menu_dropped; };

    // Get the topbar menu
    $scope.menu = Menus.getMenu('topbar');

    // Collapsing the menu after navigation
    $scope.$on('$stateChangeSuccess', function () {
      $scope.isCollapsed = false;
    });
  }
]);
