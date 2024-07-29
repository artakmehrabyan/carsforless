function ngDoFocus($timeout) {
    return {
        link: function (scope, element, attrs) {
            scope.$watch(attrs.ngDoFocus, function (value) {
                if (value === true) {
                    $timeout(function () {
                        element[0].focus();
                    });
                }
            });
        }
    };
}
