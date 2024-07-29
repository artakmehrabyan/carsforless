function ExpenseTypesController(
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
    }
    $scope.ImmediateSave = false;


    $scope.GetDataCore = function (model, tableState) {
        return itemService.GetExpenseTypes(model);
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
        isValid = !$scope.expenseTypeForm.$invalid;
        if (row != null) {
            if (row.Name == null || row.Name == '') {
                isValid = false;
            }
        }
        return isValid;
    }
    $scope.SaveCore = function (changes) {
        var deferred = $q.defer();
        itemService.SaveExpenseTypes(changes)
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
            window.$windowScope.$root.$broadcast("ExpenseTypeChange", null);
        }
    }
    $scope.DoInit();
}