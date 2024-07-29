﻿
function TitleStatusDueController(
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
        $scope.GridModel.OrderBy = "Id";
        $scope.GridModel.OrderDirection = "Desc";
        $scope.GridModel.Skip = 0;
        $scope.GridModel.Take = 300;

        
    }
    $scope.GetDataCore = function (model, tableState) {
        return itemService.GetTitleStatusDue(model);
    }
    $scope.CreateNewRow = function () {
        var row = {
            Id: 0,
           
            IsNew: true,
            Adding: true,
            Editing: true,
        };
        return row;
    }
    $scope.ValidateRowCore = function (row) {
        var isValid = true;
        isValid = !$scope.titleStatusDueForm.$invalid;
        //if (row != null) {
        //    if (row.Name == null || row.Name == '') {
        //        isValid = false;
        //    }
        //}
        return isValid;
    }
    $scope.SaveCore = function (changes) {
        var deferred = $q.defer();
        itemService.SaveTitleStatusDue(changes)
            .then(function (response) {
                var data = common.ResolveData(response);
                if (data.Success == true) {
                    $scope.Broadcast();
                }

                deferred.resolve(response);
            });
        return deferred.promise;
    }
    $scope.DrawTotals = function () {
	    //itemService.GetInventoryPartSaleStats($scope.GridModel).then(function (response) {
		   // if (common.IsValidResponse(response)) {
			  //  var data = common.ResolveData(response);
			  //  $scope.Stats = data;
			  //  $scope.TotalsVisible = true;
		   // }
	    //});
    }
    $scope.DataLoaded = function (result) {
	    $scope.DataLoadedCore(result);
	    $scope.DrawTotals();
    }
    $scope.Broadcast = function () {
        if (window.$windowScope != null) {
            window.$windowScope.$root.$broadcast("TitleStatusDueChange", null);
        }
    }
    $scope.DoInit();
}