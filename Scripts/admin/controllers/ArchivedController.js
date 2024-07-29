function ArchivedController(
    $controller,
    $rootScope,
    $scope,
    $route,
    $q,
    $location,
    $timeout,
    $filter,
    notifyService,
    spinnerService,
    itemService,
    appSession,
    appSettings,
    req,
    $window,
    common,
    store) {
    $scope.SubTotalsVisible = false;
    $scope.TotalsVisible = false;


    $controller("PublishedController", {
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
    $scope.IsInitialized = false;
    $scope.Init = function () {
        $scope.InitCore();
        $scope.GridModel.DocType = 10;
    }
    $scope.AddNew = function () {
        $window.open(appSettings.Admin_Item_EditPublishedUrl + "?doc=10", "_blank");
    }
    $scope.EditRow = function (row, newPage) {
        var url = appSettings.Admin_Item_EditPublishedUrl + "?doc=10&id=" + row.Id;
        if (newPage == true)
            $window.open(url, "_blank");
        else {
            $window.location.href = url;
        }
    }

    $scope.DoInit();
}