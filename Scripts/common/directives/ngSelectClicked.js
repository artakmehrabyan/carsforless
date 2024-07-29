function ngSelectClicked() {
    return {
        link: function (scope, element, attrs) {
            scope.clickingCallback = function () {
                element[0].select();
            };
            element.bind('click', scope.clickingCallback);
        }
    };
}
