'use strict';

// Episodes controller
angular.module('episodes').controller('EpisodesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Episodes', 'Regulars', 'Specials',
  function ($scope, $stateParams, $location, Authentication, Episodes, Regulars, Specials) {
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

    // This will fire when the create or edit page load
    $scope.getRegulars = function() {
      $scope.regulars = Regulars.query();
    };
    $scope.getSpecials = function() {
      $scope.specials = Specials.query();
    };

    // Insert REGULAR into the REGULARs list
    // regular arg is a REGULAR's _id
    $scope.addRegular = function(regular) {
      if ($scope.episode.regulars.indexOf(regular) < 0) { $scope.episode.regulars.push(regular); }
    };
    $scope.removeRegular = function(regular) {
      $scope.episode.regulars = $scope.episode.regulars.filter(function (obj) { return obj !== regular; });
    };
    $scope.getRegularName = function(regular) {
      var regular_obj = $scope.regulars.filter(function (obj) { return obj._id === regular; });
      return regular_obj[0].title;
    };

    // Clear forms
    $scope.clear = function(){
      $scope.episode = {};
      $scope.episode.title = '';
      $scope.episode.image = '';
      $scope.episode.images = [];
      $scope.episode.links = {};
      $scope.episode.categories = [];
      $scope.episode.description = {};
      $scope.episode.regulars = [];
      $scope.episode.guests = [];
      $scope.episode.aired = new Date();
      $scope.special = null;
      $scope.episode.featured = false;
    };

    // Create new Episode
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'episodeForm');

        return false;
      }

      // Create new Episode object
      var episode = new Episodes({
        title: $scope.episode.title,
        image: $scope.episode.image,
        images: $scope.episode.images,
        links: $scope.episode.links,
        categories: $scope.episode.categories,
        description: $scope.episode.description,
        regulars: $scope.episode.regulars,
        guests: $scope.episode.guests,
        aired: $scope.episode.aired,
        special: $scope.special,
        featured: $scope.episode.featured
      });

      // Redirect after save
      episode.$save(function (response) {

        $location.path('episodes/' + response._id);

        // Clear form fields
        $scope.clear();

      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Episode
    $scope.remove = function (episode) {
      if (episode) {
        episode.$remove();

        for (var i in $scope.episodes) {
          if ($scope.episodes[i] === episode) {
            $scope.episodes.splice(i, 1);
          }
        }
      } else {
        $scope.episode.$remove(function () {
          $location.path('episodes');
        });
      }
    };

    // Update existing Episode
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'episodeForm');

        return false;
      }

      var episode = $scope.episode;

      episode.$update(function () {

        $location.path('episodes/' + episode._id);

      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Episodes
    $scope.find = function () {
      $scope.episodes = Episodes.query({}, function (data) {
        var item = data[Math.floor(Math.random()*data.length)];
        $scope.changeBg(item.image);
      });
    };

    // Find existing Episode
    $scope.findOne = function () {
      $scope.episode = Episodes.get({
        episodeId: $stateParams.episodeId
      }, function(data) {
        $scope.changeBg(data.image);
      });
      $scope.regular = Regulars.get({
        episodeId: $stateParams.episodeId
      });
      $scope.specials = Specials.query({
        episodeId: $stateParams.episodeId
      });
    };

  }
]);
