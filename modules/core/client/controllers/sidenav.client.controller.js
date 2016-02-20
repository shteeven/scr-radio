'use strict';

angular.module('core').controller('SidenavController', ['$scope', '$state', 'Authentication', 'Menus',
  function ($scope, $state, Authentication, Menus) {
    // Expose view variables
    $scope.$state = $state;
    $scope.authentication = Authentication;

    //toggle side nav
    $scope.menu_toggled = false; // initialize toggle
    $scope.menuToggle = function() { $scope.menu_toggled = !$scope.menu_toggled; };

    // Get the topbar menu
    $scope.menu = Menus.getMenu('sidenav');

    // Toggle the menu items
    $scope.isCollapsed = false;
    $scope.toggleCollapsibleMenu = function () {
      $scope.isCollapsed = !$scope.isCollapsed;
    };

    // Collapsing the menu after navigation
    $scope.$on('$stateChangeSuccess', function () {
      $scope.isCollapsed = false;
    });
  }
]);
