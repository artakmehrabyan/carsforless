function maxLengthMarker() {
    var options = {
        limitReachedClass: "label label-danger",
        alwaysShow: true,
        threshold: 5
    }
    return {
        link: function (scope, element, attrs) {
            var opts = angular.extend({}, options, scope.$eval(attrs.maxLengthMarker));
            element.maxlength(opts);
        }
    }
}
