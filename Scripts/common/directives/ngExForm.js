function ngExForm($window, $timeout, $log, $parse) {
    function linkForm(scope, elem, attrs, ngModel) {
        var options = {
            'btn-default': '<i class="fa fa-chevron-right"></i>',
            'btn-loading': '<i class="fa fa-spinner fa-pulse"></i>',
            'btn-success': '<i class="fa fa-check"></i>',
            'btn-error': '<i class="fa fa-remove"></i>',
        };
        var $form = elem;
        scope.$watch("IsLoading", function (newValue, oldValue) {
            if (newValue) {
                removeLoading($form);
                formLoading($form);
            }
            else if (newValue === false) {
                removeLoading($form);
                if (scope.Succeeded) {
                    formSuccess($form);
                } else {
                    formFailed($form);
                }
                $timeout(function () {
                    removeLoading($form);
                }, 4000);
            }
        },true);
        function formLoading($form) {
            $form.find("[type=submit]").addClass("clicked").html(options["btn-loading"]);
        }
        function removeLoading($form) {
            $form.find("[type=submit]").removeClass("error success").html(options["btn-default"]);;
            $form.find(".ex-form-message").removeClass("show error success").html("");
        }
        function formSuccess($form) {
            $form.find("[type=submit]").addClass("success").html(options["btn-success"]);
            $form.find(".ex-form-message").addClass("show success").html(scope.Message);
        }
        function formFailed($form) {
            $form.find("[type=submit]").addClass("error").html(options["btn-error"]);
            $form.find(".ex-form-message").addClass("show error").html(scope.Message);
        }
    }

    return {
        restrict: "A",
        link: linkForm
    }
}