function clickGo($location) {
    return {
        link: function (scope, element, attrs) {
            element.on('click', function () {
                scope.$apply(function () {
                    $location.path(attrs.clickGo, false);
                    //$location.replace();
                });
            });
        }
    }
}
