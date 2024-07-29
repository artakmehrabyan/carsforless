function AccountController($q,
    $http,
    $scope,
    $window,
    authService,
    appSession,
    appSettings,
    notifyService,
    spinnerService,
    sessionContext,
    api) {

    $scope.IsValid = true;
    $scope.Succeeded = false;
    $scope.Model = {};

    $scope.Init = function () {
        sessionContext.Reset();
    }
    $scope.Login = function () {
        authService.Login($scope.Model, $scope);
    }
    $scope.ForgotPassword = function () {
        authService.ForgotPassword($scope.Model, $scope);
    }

    $scope.ResetPassword = function () {
        var promise = $scope.ResetPasswordPost();
        spinnerService.during(promise);
    }
    $scope.ResetPassword = function () {
        authService.ResetPassword($scope.Model, $scope);
    }

    $scope.Register = function () {
        authService.Register($scope.Model, $scope);
    }
    $scope.Init();

}