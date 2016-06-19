'use strict';

// Contents controller
angular.module('contents').controller('ContentsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Contents', 'Regulars', 'Specials',
  function ($scope, $stateParams, $location, Authentication, Contents, Regulars, Specials) {
    // TODO: Add a time picker as well as tracks
    $scope.authentication = Authentication;

    $scope.days = [
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
      'sunday'
    ];
    $scope.features = [
      'carousel',
      'tiles'
    ];

    $scope.add = function (item, field) {
      if (!($scope.content[field] instanceof Array)) {
        $scope.content[field] = [];
      }

      $scope.content[field].push(item);
      console.log($scope.content[field]);
    };

    $scope.remove = function (item, field) {
      $scope.content[field] = $scope.content[field].filter(function (obj) { return obj !== item; });
    };

    // This will fire when the create or edit page load
    // $scope.getRegulars = function() {
    //   $scope.regulars = Regulars.query();
    // };
    // $scope.getSpecials = function() {
    //   $scope.specials = Specials.query();
    // };

    // Insert REGULAR into the REGULARs list
    // regular arg is a REGULAR's _id
    // $scope.addRegular = function(regular) {
    //   if ($scope.content.regulars.indexOf(regular) < 0) { $scope.content.regulars.push(regular); }
    // };
    // $scope.removeRegular = function(regular) {
    //   $scope.content.regulars = $scope.content.regulars.filter(function (obj) { return obj !== regular; });
    // };
    // $scope.getRegularName = function(regular) {
    //   var regular_obj = $scope.regulars.filter(function (obj) { return obj._id === regular; });
    //   return regular_obj[0].title;
    // };

    // Clear forms
    $scope.clear = function(){
      $scope.content = {};
      $scope.content.title = '';
      $scope.content.image = '';
      $scope.content.images = [];
      $scope.content.links = {};
      $scope.content.categories = [];
      $scope.content.description = {};
      $scope.content.regulars = [];
      $scope.content.guests = [];
      $scope.content.air = new Date();
      $scope.special = null;
      $scope.content.featured = false;
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
        image: $scope.content.image,
        images: $scope.content.images,
        links: $scope.content.links,
        categories: $scope.content.categories,
        description: $scope.content.description,
        regulars: $scope.content.regulars,
        guests: $scope.content.guests,
        aired: $scope.content.aired,
        special: $scope.special,
        featured: $scope.content.featured
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
      $scope.contents = Contents.query({}, function (data) {
        var item = data[Math.floor(Math.random()*data.length)];
        $scope.changeBg(item.image);
      });
    };

    // Find existing Content
    $scope.findOne = function () {
      $scope.content = Contents.get({
        contentId: $stateParams.contentId
      }, function(data) {
        $scope.changeBg(data.image);
      });
      $scope.regular = Regulars.get({
        contentId: $stateParams.contentId
      });
      $scope.specials = Specials.query({
        contentId: $stateParams.contentId
      });
    };

  }
]);
