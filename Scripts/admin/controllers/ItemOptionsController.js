function ItemOptionsController(
    $controller,
    $q,
    $http,
    $rootScope,
    $scope,
    $route,
    $location,
    $window,
    $filter,
    $timeout,
    api,
    appSession,
    appSettings,
    notifyService,
    spinnerService,
    common,
    itemService) {

    $scope.LoadOptions = function () {
        var requestModel = {
            Search: "",
            Skip: 0,
            Take: 1000,
            OrderBy: "Name",
            OrderDirection: "Asc",
        };
        itemService.GetCarOptions(requestModel)
            .then(function (response) {
                var data = common.ResolveData(response);
                if (common.IsValidResponse(data) && data.Success == true) {
                    $scope.VisibleRows = data.Set;                   
                }
            });
    }
    $scope.SyncCheckboxes = function () {
        $timeout(function () {
            angular.forEach($scope.VisibleRows, function (value, key) {
                if ($scope.IsSelected(value) == true) {
                    $scope.SelectRow(value);
                }
            });
        }, 100);
    }
    $scope.IsSelected = function (opt) {

        var result = false;
        if ($scope.ItemOptions == null)
            return false;
        
        angular.forEach($scope.ItemOptions, function (sub, subkey) {
            if (result == false) {
                if (sub.Id == opt.Id) {
                    
                    result = true;
                }
            }
        });
        return result;
    }
    
    

    $controller("GridControllerBase", {
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
        $scope.InitCore();
        $scope.GridModel.OrderBy = "Name";
        $scope.GridModel.OrderDirection = "Asc";
        $scope.LoadOptions();
        $rootScope.$on("ItemLoaded", function () {
            $scope.ItemOptions = $scope.EditableObject.Options;
            $scope.SyncCheckboxes();
        });

        $rootScope.$on("ItemSaving", function () {
            $scope.EditableObject.Options = $scope.Selection.Rows;
        });
    }
    $scope.DoInit();
}