function datePick($parse, $filter) {
    return {
        require: '?ngModel',
        restrict: 'A',
        link: function (scope, element, attrs, controller) {
            var changing = false;
            var updateModel = function (ev) {
                element.datepicker("hide");
                element.blur();
                //return scope.$apply(function () {
                //    changing = true;
                //    var val = controller.$setViewValue(ev.date);
                //    changing = false;
                //    return val;
                //});
            };
            var modelAccessor = $parse(attrs.ngModel);
            var getOptions = function (value) {
                var defaults = {
                    autoclose: true,
                    language: "en-US",
                    format: "dd/mm/yyyy",
                    //changeDate: updateModel,
                };
                var result = {};
                var hasValue;
                var options = {}
                if (angular.isObject(value)) {
                    options = value;
                    hasValue = true;
                }
                if (typeof (value) === "string" && value.length > 0) {
                    options = angular.fromJson(value);
                    hasValue = true;
                }
                if (hasValue) {
                    angular.extend(result, defaults, options);
                }
                return result;
            }
            var attValue = attrs.datePick;
            var opt = getOptions(attValue);
            element.datepicker(opt).on("changeDate", updateModel);
            scope.$watch(modelAccessor, function (value, old) {
                if (changing == true)
                    return;
                var newDate = new Date(value);
                if (newDate.getTimezoneOffset() > 0) {
                    newDate.setTime(newDate.getTime() + newDate.getTimezoneOffset() * 60 * 1000);
                }

                if (value) {
                    //element.datepicker('setValue', newDate);
                    changing = true;
                    element.datepicker("update", newDate);
                    changing = false;
                }
            });
        }
    };
}

