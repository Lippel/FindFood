// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'ngCordova', 'backand', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function (BackandProvider, $stateProvider, $urlRouterProvider, $httpProvider) {

    BackandProvider.setAppName('findfoodapp');
    BackandProvider.setSignUpToken('5b86ee71-335b-497b-aee1-f4592c5bb1eb');
    BackandProvider.setAnonymousToken('3b3bd74f-d2c0-42c1-865b-34eade19754f');

    $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.search', {
    url: '/search',
    views: {
      'menuContent': {
          templateUrl: 'templates/search.html',
          controller: 'SearchCtrl'
      }
    }
  })

.state('app.cadUsuario', {
    url: '/cadUsuario',
    views: {
        'menuContent': {
            templateUrl: 'templates/cadUsuario.html',
            controller: 'CadUserCtrl as cu'
        }
    }
})

.state('app.cadEstabelecimento', {
    url: '/cadEstabelecimento',
    views: {
        'menuContent': {
            templateUrl: 'templates/cadEstabelecimento.html',
            controller: 'CadEstabCrtl as ce'
        }
    }
})
  // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/search');

 //   $httpProvider.interceptors.push('APIInterceptor');
});
