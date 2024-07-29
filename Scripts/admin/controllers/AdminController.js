function AdminController(
    $controller,
    $scope,
    common,
    manage,
    notifyService,
    spinnerService,
    appSession) {
    
    $scope.ResetCache = function () {
        manage.ResetCache();
    }
    $scope.ReloadPage = function (clearCache) {
        location.reload(clearCache);
    }
};