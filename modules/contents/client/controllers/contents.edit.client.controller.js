'use strict';

// Contents controller
angular.module('contents').controller('ContentsEditController', ['$scope', '$stateParams', '$location', 'Authentication', 'Contents',
  function ($scope, $stateParams, $location, Authentication, Contents) {
    $scope.regulars = Contents.query({ category: 'regular', guest: false });
    $scope.specials = Contents.query({category: 'special'});
    $scope.allRegulars = Contents.query({category: 'regular'});
    $scope.content = Contents.get({
      contentId: $stateParams.contentId
    }, function (data) {
      $scope.changeBg(data.image);
    });


    $scope.features = [
      'carousel',
      'tiles'
    ];
    $scope.categories = [
      'regular',
      'special',
      'episode',
      'event'
    ];

    $scope.add = function (item, field) {
      if (!($scope.content[field] instanceof Array)) {
        $scope.content[field] = [];
      }
      $scope.content[field].push(item);
    };

    $scope.remove = function (item, field) {
      $scope.content[field] = $scope.content[field].filter(function (obj) {
        return obj !== item;
      });
    };

    $scope.select = function (item, field) {
      $scope.content[field] = item;
    };

    $scope.getTitleFromId = function (id) {
      var obj = $scope.contents.filter(function (obj) {
        return obj._id === id;
      });
      if (obj[0]) {
        return obj[0].title;
      }
    };

    // Update existing Content
    $scope.updateContent = function (isValid) {
      $scope.error = null;
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'contentForm');
        return false;
      }
      console.log($scope.content);
      $scope.content.$update(function (data) {
        console.log(data);
        $location.path('contents/' + $scope.content._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

  }
]);
