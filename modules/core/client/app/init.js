'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider', '$httpProvider', '$mdThemingProvider',
  function ($locationProvider, $httpProvider, $mdThemingProvider) {


    // $mdThemingProvider.definePalette('amazingPaletteName', {
    //   // '50': 'ffebee',
    //   // '100': 'ffcdd2',
    //   // '200': 'ef9a9a',
    //   // '300': 'e57373',
    //   // '400': 'ef5350',
    //   // '500': 'f44336',
    //   // '600': 'e53935',
    //   // '700': 'd32f2f',
    //   // '800': 'c62828',
    //   // '900': 'b71c1c',
    //   // 'A100': 'ff8a80',
    //   // 'A200': 'ff5252',
    //   // 'A400': 'ff1744',
    //   // 'A700': 'd50000',
    //   '50': '000000',
    //   '100': '000000',
    //   '200': '000000',
    //   '300': '000000',
    //   '400': '000000',
    //   '500': '000000',
    //   '600': '000000',
    //   '700': '000000',
    //   '800': '000000',
    //   '900': '000000',
    //   'A100': '000000',
    //   'A200': '000000',
    //   'A400': '000000',
    //   'A700': '000000',
    //   'contrastDefaultColor': 'light',    // whether, by default, text (contrast)
    //                                       // on this palette should be dark or light
    //   'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
    //     '200', '300', '400', 'A100'],
    //   'contrastLightColors': undefined    // could also specify this if default was 'dark'
    // });
    $mdThemingProvider.theme('scr-main')
      .primaryPalette('grey')
      .accentPalette('blue-grey')
      .dark();

    // $mdThemingProvider.theme('default').primaryPalette('red').dark();

    $locationProvider.html5Mode(true).hashPrefix('!');

    $httpProvider.interceptors.push('authInterceptor');
  }
]);

angular.module(ApplicationConfiguration.applicationModuleName).run(function ($rootScope, $state, Authentication) {

  // Play Mixcloud plugin on click
  // TODO: move events to service for media players
  $rootScope.playerPlay = function(url) {
    $rootScope.$broadcast('player.play', { url: url });
  };

  // Language toggling
  $rootScope.toggleLanguage = function() {
    $rootScope.lang = $rootScope.lang === 'kr' ? 'en' : 'kr';
  };

  // For dynamic backgrounds. Call within findOne() in each module's controller
  // Set in layout.server.view.html
  $rootScope.changeBg = function(url) {
    $rootScope.currentBg = 'url(' + url + ')';
  };

  // Check authentication before changing state
  $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
    if (toState.data && toState.data.roles && toState.data.roles.length > 0) {
      var allowed = false;
      toState.data.roles.forEach(function (role) {
        if (Authentication.user.roles !== undefined && Authentication.user.roles.indexOf(role) !== -1) {
          allowed = true;
          return true;
        }
      });

      if (!allowed) {
        event.preventDefault();
        if (Authentication.user !== undefined && typeof Authentication.user === 'object') {
          $state.go('forbidden');
        } else {
          $state.go('authentication.signin').then(function () {
            storePreviousState(toState, toParams);
          });
        }
      }
    }
  });

  // Record previous state
  $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
    storePreviousState(fromState, fromParams);
  });

  // Store previous state
  function storePreviousState(state, params) {
    // only store this state if it shouldn't be ignored 
    if (!state.data || !state.data.ignoreState) {
      $state.previous = {
        state: state,
        params: params,
        href: $state.href(state, params)
      };
    }
  }
});

//Then define the init function for starting up the application
angular.element(document).ready(function () {
  //Fixing facebook bug with redirect
  if (window.location.hash && window.location.hash === '#_=_') {
    if (window.history && history.pushState) {
      window.history.pushState('', document.title, window.location.pathname);
    } else {
      // Prevent scrolling by storing the page's current scroll offset
      var scroll = {
        top: document.body.scrollTop,
        left: document.body.scrollLeft
      };
      window.location.hash = '';
      // Restore the scroll offset, should be flicker free
      document.body.scrollTop = scroll.top;
      document.body.scrollLeft = scroll.left;
    }
  }

  //Then init the app
  angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});
