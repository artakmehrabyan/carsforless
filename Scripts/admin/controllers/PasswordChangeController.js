function PasswordChangeController(
    $controller,
    $rootScope,
    $scope,
    $route,
    notifyService,
    spinnerService,
    itemService,
    appSession,
    appSettings,
    $window,
    $location,
    $filter,
    $q,
    $timeout,
    common,
    accountService) {


    $controller("ControllerBase", {
        $controller: $controller,
        $rootScope: $rootScope,
        $scope: $scope,
        $route: $route,
        $q: $q,
        $location: $location,
        $timeout: $timeout,
        $filter: $filter,
        appSession: appSession,
        notifyService: notifyService,
        spinnerService: spinnerService,
        common: common,
        appSettings: appSettings,
    });

    $scope.Init = function () {
        $scope.Clear();
    };
    $scope.Clear=function() {
        $scope.PasswordChangeData = {
            OldPassword: "",
            Password: "",
            ConfirmPassword: ""
        }
    }
    $scope.ChangePassword = function() {
        if ($scope.PasswordChangeData.IsValid == false)
            return false;

        common.StartLoading($scope, true);
        accountService.ChangePassword($scope.PasswordChangeData)
            .then(function(response) {
                var data = common.ResolveData(response);
                if (common.IsValidResponse(data) && data.Succeeded) {
                    common.StopLoadingResponse(response, true, $scope, false);
                    notifyService.info("Password Change", "Password successfully has been changed!");
                    $scope.Clear();
                }
            }, function(response) {
                common.StopLoadingResponse(response, true, $scope, true);
            });
    };
    $scope.DoInit();
}