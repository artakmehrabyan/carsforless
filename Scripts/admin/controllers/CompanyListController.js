function CompanyListController(
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
    companyService) {
    
    
    
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
    }
    $scope.ImmediateSave = false;
   
    
    $scope.GetDataCore = function (model, tableState) {
        return companyService.GetCompanies(model);
    }
    $scope.CreateNewRow = function () {
        var row = {
            Id: 0,
            Name: '',
            Description: '',
            OperationAuthority: null,
            IsCustomer: true,
            IsSupplier: true,
            IsOurCompany:false,
            IsNew: true,
            Adding: true,
            Editing: true,
        };
        return row;
    }
    $scope.ValidateRowCore = function (row) {
        var isValid = true;
        isValid = !$scope.companyForm.$invalid;
        if (row != null) {
            if (row.Name == null || row.Name == null) {
                isValid = false;
            }
            if (row.IsCustomer == false && row.IsSupplier == false) {
                isValid = false;
            }
        }
        return isValid;
    }
    $scope.SaveCore = function (changes) {
        var deferred = $q.defer();
        var promise=companyService.SaveCompanies(changes)
            .then(function (response) {
                var data = common.ResolveData(response);
                if (data.Success == true) {
                    $scope.Broadcast();
                    deferred.resolve(response);
                }
            }, function (response) {
                deferred.reject(response);
            });
        return deferred.promise;
    }
    $scope.Broadcast = function () {
        if (window.$windowScope != null) {
            window.$windowScope.$root.$broadcast("CompanyChange", null);
        }
    }
    $scope.DoInit();
}