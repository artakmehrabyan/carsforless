function ModelsController(
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
    $scope.Init = function () {
        $scope.InitCore();
        $scope.GridModel.OrderBy = "Name";
        $scope.GridModel.OrderDirection = "Asc";
        $scope.GridModel.VirtualLoad = true;
        $scope.GridModel.VirtualLoadPageSize = 50;
        itemService.GetManufacturers().then(function (response) {
            var data = common.ResolveData(response);
            if (common.IsValidResponse(data)) {
                $scope.Manufacturers = data;
            }
        });
    }

    $scope.ImmediateSave = false;
    
    $scope.GetDataCore = function (model, tableState) {
        return itemService.GetModels(model);
    }
    $scope.CreateNewRow = function () {
        var row = {
            Id: 0,
            Name: '',
            IsNew: true,
            Adding: true,
            Editing: true,
        };
        return row;
    }
    $scope.ValidateRowCore = function (row) {
        var isValid = true;
        if ($scope.modelForm.$invalid)
            return false;
        if (row != null) {
            if (row.Name == null || row.Name == "") {
                isValid = false;
            }
            if (row.ManufacturerId == null || row.ManufacturerId == null) {
                isValid = false;
            }
        }
        return isValid;
    }
    $scope.OnManufacturerChanged = function (row) {
        var manufacturer;
        for (var i = 0, len = $scope.Manufacturers.length; i < len; i++) {
            var value = $scope.Manufacturers[i];
            if (value.Id == row.ManufacturerId) {
                manufacturer = value;
                break;
            }
        }
        if (manufacturer != null) {
            row.ManufacturerName = manufacturer.Name;
        }
    }
    $scope.SaveCore = function (changes) {
        var deferred = $q.defer();
        itemService.SaveModels(changes)
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
            window.$windowScope.$root.$broadcast("ModelsChange", null);
        }
    }
    $scope.DoInit();
}