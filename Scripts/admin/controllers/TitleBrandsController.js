function TitleBrandsController(
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


    
    $controller("InlineEditControllerBase", {
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
    $scope.ImmediateSave = false;
    $scope.Init = function () {
        $scope.InitCore();
        $scope.GridModel.OrderBy = "Description";
        $scope.GridModel.OrderDirection = "Asc";
    }

    $scope.GetDataCore = function (model, tableState) {
        return itemService.GetTitleBrands(model);
    }
    $scope.CreateNewRow = function () {
        var row = {
            Id: 0,
            Description: "",
            IsNew: true,
            Adding: true,
            Editing: true,
        };
        return row;
    }
    $scope.ValidateRowCore = function (row) {
        var isValid = true;
        isValid = !$scope.titleBrandForm.$invalid;
        if (row != null) {
            if (row.Description == null || row.Description == '') {
                isValid = false;
            }
        }
        return isValid;
    }
    $scope.SaveCore = function (changes) {
        var deferred = $q.defer();
        itemService.SaveTitleBrands(changes)
            .then(function (response) {
                var data = common.ResolveData(response);
                if (data.Success == true) {
                    $scope.Broadcast();
                }
                deferred.resolve(response);
            });
        return deferred.promise;
    }
    $scope.Broadcast = function () {
        if (window.$windowScope != null) {
            window.$windowScope.$root.$broadcast("TitleBrandChange", null);
        }
    }

    $scope.DoInit();
}