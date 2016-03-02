'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$state', 'Authentication', 'Menus',
  function ($scope, $state, Authentication, Menus) {
    // Expose view variables
    $scope.$state = $state;
    $scope.authentication = Authentication;

    // Get the topbar menu
    $scope.menu = Menus.getMenu('topbar');

    //init state
    $scope.main_links = {
      facebook: 'https://www.facebook.com/seoulcommunityradio/',
      twitter: 'https://about.twitter.com/?utm_source=google&utm_medium=cpc&utm_campaign=PFX_SEM_GW_US_EVERGREEN_TIER%201_EXACT_LPTESTABOUT&utm_content=Twitter&utm_term=twitter&gclid=CjwKEAiAgKu2BRDu1OGw3-KXokwSJAB_Yy2QotutFQSUIwmfVBG89i16JZMaDpiV6M6hgN0EKYpsihoC4P7w_wcB&gclsrc=aw.ds',
      home: 'https://www.facebook.com/shteeven',
      mixcloud: 'https://www.facebook.com/shteeven'
    };

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
