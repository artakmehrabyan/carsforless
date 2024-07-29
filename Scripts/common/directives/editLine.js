function editLine() {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
            // view -> model
            elm.bind('focus', function () {
                scope.$apply(function () {
                    scope.a = elm.val();
                    ctrl.$setViewValue(elm.html());

                });
            });

            // model -> view
            ctrl.render = function (value) {
                elm.html(value);
            };

            // load init value from DOM
            //ctrl.$setViewValue(elm.html());

            elm.bind('keydown', function (event) {

                var esc = event.which == 27,
                    el = event.target;

                if (esc) {
                    elm.val(scope.a);
                    el.blur();
                    event.preventDefault();
                }

            });

        }
    };

}