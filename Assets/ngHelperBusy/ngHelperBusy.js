'use strict';

/**
 * The module contains everything we need to handle the busy indicator logic
 */
var ngHelperBusy = angular.module('ngHelperBusy', []);

/**
 * @ngdoc directive
 * @name ngHelperBusy.directive:ngHelperBusy
 * @description
 * # ngHelperBusy
 */
ngHelperBusy.directive('ngHelperBusy',['$busy', function ($busy) {
    return {
        template: '<div id="ngHelperBusyLayer">' +
            '               <div class="loader">' +
            '                   <div class="loader-inner  {{loader}}">' +
            '                       <div ng-repeat="node in nodes" class="{{loaderClass}}"></div>' +
            '                   </div>' +
            //'              <div class="message">{{busyMessage}}' +
            '              </div></div>',
        restrict: 'CEA',
        scope: true,
        controller: 'NgHelperBusyCtrl'
    };
}]);

/**
 * @ngdoc controller
 * @name ngHelperBusy.controller:ngHelperBusy
 * @description
 * # ngHelperBusy
 */
ngHelperBusy.controller('NgHelperBusyCtrl', ['$scope', '$rootScope', '$busy', function($scope, $rootScope, $busy) {
    var defaultMessage = "Please stay tuned...";
    //"ball-pulse"                  : 3,
    //     "ball-grid-pulse"             : 9,
    //     "ball-clip-rotate"            : 1,
    //     "ball-clip-rotate-pulse"      : 2,
    //     "square-spin"                 : 1,
    //     "ball-clip-rotate-multiple"   : 2,
    //     "ball-pulse-rise"             : 5,
    //     "ball-rotate"                 : 1,
    //     "cube-transition"             : 2,
    //     "ball-zig-zag"                : 2,
    //     "ball-zig-zag-deflect"        : 2,
    //     "ball-triangle-path"          : 3,
    //     "ball-scale"                  : 1,
    //     "line-scale"                  : 5,
    //     "line-scale-party"            : 4,
    //     "ball-scale-multiple"         : 3,
    //     "ball-pulse-sync"             : 3,
    //     "ball-beat"                   : 3,
    //     "line-scale-pulse-out"        : 5,
    //     "line-scale-pulse-out-rapid"  : 5,
    //     "ball-scale-ripple"           : 1,
    //     "ball-scale-ripple-multiple"  : 3,
    //     "ball-spin-fade-loader"       : 8,
    //     "line-spin-fade-loader"       : 8,
    //     "triangle-skew-spin"          : 1,
    //     "pacman"                      : 5,
    //     "ball-grid-beat"              : 9,
    //     "semi-circle-spin"            : 1
    var loaders = [

        { name: "ball-pulse", val: 3 },
        { name: "ball-grid-pulse", val:  9 },
        { name: "ball-clip-rotate", val:  1 },
        { name: "square-spin", val:  1 },
        { name: "ball-clip-rotate-multiple", val:  2 },
        { name: "ball-rotate", val:  1 },
        { name: "ball-scale", val:  1 },
        { name: "ball-scale", val:  1 },
        { name: "ball-scale", val:  1 },
        { name: "ball-scale", val:  1 },
        { name: "line-scale", val:  5 },
        { name: "line-scale-party", val:  4 },
        { name: "ball-scale-multiple", val:  3 },
        { name: "ball-scale-multiple", val:  3 },
        { name: "ball-scale-multiple", val:  3 },
        { name: "ball-scale-multiple", val:  3 },
        { name: "ball-pulse-sync", val:  3 },
        { name: "ball-beat", val:  3 },
        { name: "line-scale-pulse-out", val:  5 },
        { name: "line-scale-pulse-out-rapid", val:  5 },
        { name: "ball-scale-ripple", val:  1 },
        { name: "ball-scale-ripple-multiple", val:  3 },
        { name: "ball-spin-fade-loader", val:  8 },
        { name: "line-spin-fade-loader", val:  8 },
        { name: "pacman", val:  5 },
        { name: "pacman", val:  5 },
        { name: "pacman", val:  5 },
        { name: "pacman", val:  5 },
        { name: "pacman", val:  5 },
        { name: "pacman", val:  5 },
        { name: "pacman", val:  5 },
        { name: "pacman", val:  5 },
        { name: "pacman", val:  5 },
        { name: "ball-grid-beat", val:  9 },
        { name: "semi-circle-spi", val:  1 },
    ];
    
    
    $scope.nodes = [];
    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }
    var min = 0, max = loaders.length - 1;
    function initLoader() {
        var random = getRandomInt(min, max);
        $scope.loader = loaders[random].name;
        $scope.loaderClass = $scope.loader;

        for (var i = 0 ; i < loaders[random].val; i++) {
            $scope.nodes.push(i);
        }
    }
    initLoader();
    $scope.busyMessage = defaultMessage;
    
    $rootScope.$on('$busy.setMessage', function () {
        $scope.busyMessage = $busy.getBusyMessage();
    });

    $rootScope.$on('$busy.resetMessage', function() {
        $scope.busyMessage = defaultMessage;
    });
}]);

/**
 * @ngdoc service
 * @name ngHelperBusy.service:ngHelperBusy
 * @description
 * # ngHelperBusy
 */
ngHelperBusy.service('$busy', [ '$q', '$rootScope', function($q, $rootScope) {
    var self = this;
    var currentMessage = null;
   
    self.getBusyMessage = function() {
        return currentMessage;
    };

    self.setMessage = function(message) {
        currentMessage = message;
        $rootScope.$emit("$busy.setMessage");
    };

    self.resetMessage = function() {
        currentMessage = null;
        $rootScope.$emit("$busy.resetMessage");
    };

    self.during = function(promise) {

        // generate a promise
        var deferred = $q.defer();

        // make us busy
        self.beBusy();

        // wait until the given promise is done
        $q.when(promise).then(function(data) {
            // make us free
            self.beFree();

            // just call the then method of the original promise
            deferred.resolve(data);

        }, function(reason) {
            self.beFree();
            deferred.reject(reason);
        }, function(update) {
            deferred.notify(update);
        });

        // return our promise
        return deferred.promise;
    };

    self.beBusy = function() {
        // bring up the busy layer
        var busyElement = document.getElementById("ngHelperBusyLayer");
        if (busyElement !== null && busyElement !== undefined) {
            busyElement.classList.add("busy");
        }

        // lock the body
        var bodyElement = document.getElementsByTagName("body")[0];
        if (bodyElement !== null && bodyElement !== undefined) {
            bodyElement.classList.add("ngHelperBusyLayerNoScroll");
        }
    };

    self.beFree = function() {

        // hide the busy layer when done
        var busyElement = document.getElementById("ngHelperBusyLayer");
        var bodyElement = document.getElementsByTagName("body")[0];

        if (busyElement !== null && busyElement !== undefined) {
            busyElement.classList.remove("busy");
        }

        if (bodyElement !== null && bodyElement !== undefined) {
            bodyElement.classList.remove("ngHelperBusyLayerNoScroll");
        }

        // reset the message
        self.resetMessage();
    };
}]);