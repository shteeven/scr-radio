'use strict';

// Contents controller
angular.module('contents').controller('ContentsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Contents',
  function ($scope, $stateParams, $location, Authentication, Contents) {
    $scope.authentication = Authentication;
    $scope.tile_limit = 122;
    $scope.rowLength = 4;
    var content;

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
      $scope.findOne(true);
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
      $scope.content[field] = $scope.content[field].filter(function (obj) {
        return obj !== item;
      });
    };

    $scope.select = function (item, field) {
      console.log(item);
      console.log(field);
      $scope.content[field] = item;
      console.log($scope.content[field]);
    };

    $scope.getTitleFromId = function (id) {
      var obj = $scope.contents.filter(function (obj) {
        return obj._id === id;
      });
      if (obj[0]) {
        return obj[0].title;
      }
    };

    // Clear forms
    $scope.clear = function (data) {
      // if (data) {
      //   $scope.content = {};
      //   $scope.content.title = data.title;
      //   $scope.content.headline = content.headline;
      //   $scope.content.description = data.description;
      //   $scope.content.image = data.image;
      //   $scope.content.category = data.category;
      //   $scope.content.guest = data.guest;
      //   $scope.content.featured = data.featured;
      //   $scope.content.links = data.links;
      //   $scope.content.aired = data.aired;
      //   $scope.content.belongsToRegular = data.belongsToRegular;
      //   $scope.content.belongsToSpecial = data.belongsToSpecial;
      //   $scope.content.guests = data.guests;
      // } else {
        $scope.content = {};
        $scope.content.title = '';
        $scope.content.headline = {};
        $scope.content.description = {};
        $scope.content.image = '';
        $scope.content.category = '';
        $scope.content.guest = null;
        $scope.content.featured = [];
        $scope.content.links = {};
        $scope.content.aired = new Date();
        $scope.content.belongsToRegular = [];
        $scope.content.belongsToSpecial = [];
        $scope.content.guests = [];
      // }
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
    $scope.updateContent = function (isValid) {
      console.log(content);
      content.title = $scope.content.title;
      content.headline = $scope.content.headline;
      content.description = $scope.content.description;
      content.image = $scope.content.image;
      content.category = $scope.content.category;
      content.guest = $scope.content.guest;
      content.featured = $scope.content.featured;
      content.links = $scope.content.links;
      content.aired = $scope.content.aired;
      content.belongsToRegular = $scope.content.belongsToRegular;
      content.belongsToSpecial = $scope.content.belongsToSpecial;
      content.guests = $scope.content.guests;
      console.log(content);
      $scope.error = null;
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'contentForm');
        return false;
      }
      content.$update(function (data) {
        console.log(data);

        $location.path('contents/' + content._id);

      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Contents
    $scope.find = function () {
      var query = $stateParams.contentType ? {category: $stateParams.contentType} : {};
      $scope.contents = Contents.query(query, function (data) {
        console.log(data);
        $scope.changeBg();
      });
    };

    // Find existing Content
    $scope.findOne = function (edit) {
      Contents.get({
        contentId: $stateParams.contentId
      }, function (data) {
        if (edit) {
          content = data;
          $scope.clear(data);
        } else {
          $scope.content = data;
        }
        $scope.changeBg(data.image);
      });
    };

  }
]);
