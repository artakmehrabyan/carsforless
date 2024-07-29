var app = angular.module("ngContextMenu", []);
var pointerEvents = "contextmenu";

app.directive("contextmenu", ["$parse", function ($parse) {

    var $window = angular.element(window);

    return {
        restrict: "A",
        scope: false,
        controller: ["$scope", "$attrs", function ($scope, $attrs) {
            var ctrl = {};

            ctrl.$element = null;
            ctrl.$isOpen = false;

            ctrl.close = function () {
                ctrl.$element.toggleClass("open", false);
                ctrl.$isOpen = false;
            };

            ctrl.open = function (item, event) {
               
                var getMousePos = function (e) {
                    var elm = $(ctrl.$element);
                    var parentOffset = elm.parent().offset();
                    //now minus parent element offset instead current element
                    var x = (e.pageX)- parentOffset.left;
                    var y = (e.pageY+30)-parentOffset.top;

                    return { x: x, y: y };
                }

                ctrl.$item = item;
                var pos = getMousePos(event);
                
                //var top = event.screenY - $window.scrollTop();
                ctrl.$element.css('left', pos.x+'px');
                ctrl.$element.css('top', pos.y+ 'px');
                ctrl.$element.toggleClass('open', true);
                ctrl.$isOpen = true;

                return ctrl.isOpen;
            };

            var closeEvents = pointerEvents + ' ' + 'click';
         
            $window.on(closeEvents, function () {
                if (ctrl.$isOpen) {
                    ctrl.close();
                }
            });

            return ctrl;
        }],
        link: function ($scope, $element, $attrs, $ctrl) {
            $ctrl.$element = $element;
            $parse($attrs.contextmenu).assign($scope, $ctrl);
        }
    }
}]);

app.directive('contextmenuContainer', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        scope: false,
        controller: [
            '$scope', '$attrs', function($scope, $attrs,contextMenuCtrl) {
                return $parse($attrs.contextmenuContainer)($scope);
            }
        ],
        link: function ($scope, $element, $attrs, contextMenuCtrl) {
            var iam = $scope[($attrs.contextmenuItem)];
            $element.on(pointerEvents, function (event) {
                $scope.$apply(function () {
                    contextMenuCtrl.open(iam, event);
                });
                event.stopPropagation();
                return false;
            });
        }
    }
}]);

app.directive("contextmenuItem", [function () {
    return {
        restrict: "A",
        require: '^contextmenuContainer',
        scope: false,
        link: function ($scope, $element, $attrs, contextMenuCtrl) {

            var iam = $scope[($attrs.contextmenuItem)];
            $element.on(pointerEvents, function (event) {
                $scope.$apply(function () {
                    contextMenuCtrl.open(iam, event);
                });
                event.stopPropagation();
                return false;
            });
        }
    }
}]);
