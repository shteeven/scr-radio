'use strict';
//noinspection JSAnnotator
/**
 * Created by stevenbarnhurst on 7/22/16.
 *
 * Converts json encoded strings to original string format
 */

angular.module('core').filter('jsonToHtml', function() {
    return function(input){
        return input ? input.replace(/&amp;/g, '&') : '';
    };
});