'use strict';

// Contents controller
angular.module('contents').controller('ContentsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Contents',
  function ($scope, $stateParams, $location, Authentication, Contents) {
    $scope.authentication = Authentication;
    $scope.tile_limit = 122;
    $scope.rowLength = 4;

    // on creating content
    $scope.forCreate = function () {
      $scope.contents = Contents.query({ guest: false });
      $scope.regulars = Contents.query({ category: 'regular', guest: false });
      $scope.specials = Contents.query({ category: 'special' });
      $scope.allRegulars = Contents.query({ category: 'regular' });
      $scope.clear();
    };
    // on editing content
    $scope.forEdit = function () {
      $scope.contents = Contents.query({ guest: false });
      $scope.regulars = Contents.query({ category: 'regular', guest: false });
      $scope.specials = Contents.query({ category: 'special' });
      $scope.allRegulars = Contents.query({ category: 'regular' });
      $scope.findOne();
    };
    
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
      $scope.content[field] = $scope.content[field].filter(function (obj) { return obj !== item; });
    };

    $scope.select = function (item, field) {
      $scope.content[field] = item;
    };

    $scope.getTitleFromId = function(id) {
      var obj = $scope.contents.filter(function (obj) { return obj._id === id; });
      if (obj[0]) {
        return obj[0].title;
      }
    };

    // Clear forms
    $scope.clear = function(){
      $scope.content = {};
      $scope.content.title = '';
      $scope.content.headline = {};
      $scope.content.description = {};
      $scope.content.image = '';
      $scope.content.category = {};
      $scope.content.guest = null;
      $scope.content.featured = [];
      $scope.content.links = {};
      $scope.content.aired = new Date();
      $scope.content.belongsToRegular = [];
      $scope.content.belongsToSpecial = [];
      $scope.content.guests = [];
    };

    // Create new Content
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'contentForm');

        return false;
      }

      // Create new Content object
      var content = new Contents({
        title: $scope.content.title,
        headline: $scope.content.headline,
        description: $scope.content.description,
        image: $scope.content.image,
        category: $scope.content.category,
        guest: $scope.content.guest,
        featured: $scope.content.featured,
        links: $scope.content.links,
        aired: $scope.content.aired,
        belongsToRegular: $scope.content.belongsToRegular,
        belongsToSpecial: $scope.belongsToSpecial,
        guests: $scope.content.guests
      });

      // Redirect after save
      content.$save(function (response) {

        $location.path('contents/' + response._id);

        // Clear form fields
        $scope.clear();

      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Content
    $scope.removeContent = function (content) {
      if (content) {
        content.$remove();

        for (var i in $scope.contents) {
          if ($scope.contents[i] === content) {
            $scope.contents.splice(i, 1);
          }
        }
      } else {
        $scope.content.$remove(function () {
          $location.path('contents');
        });
      }
    };

    // Update existing Content
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'contentForm');

        return false;
      }

      var content = $scope.content;

      content.$update(function () {

        $location.path('contents/' + content._id);

      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Contents
    $scope.find = function () {
      var query = $stateParams.contentType ? { category: $stateParams.contentType } : {};
      $scope.contents = Contents.query(query, function (data) {
        console.log(data);
        $scope.changeBg();
      });
    };

    // Find existing Content
    $scope.findOne = function () {
      $scope.content = Contents.get({
        contentId: $stateParams.contentId
      }, function(data) {
        $scope.changeBg(data.image);
      });
    };

  }
]);
