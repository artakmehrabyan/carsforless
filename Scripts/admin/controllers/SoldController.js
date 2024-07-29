function SoldController(
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
    common) {
    $scope.SubTotalsVisible = false;
    

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
        $scope.FilterByList = ["SoldDate", "LotDate"];
        $scope.GridModel.OrderBy = "SoldDate";
        $scope.GridModel.OrderDirection = "Desc";
        $scope.GridModel.DocType = 2;
        $scope.GridModel.FilterBy = "SoldDate";
        $scope.GridModel.Skip = 0;
        $scope.OrderByDirList = ["Asc", "Desc"];
        $scope.OrderByList = [
            { Name: "No", DisplayName: "No" },
            { Name: "Type", DisplayName: "Type" },
            { Name: "Vin", DisplayName: "Vin" },
            { Name: "Description", DisplayName: "Description" },
            { Name: "Year", DisplayName: "Year" },
            { Name: "Make", DisplayName: "Make" },
            { Name: "Model", DisplayName: "Model" },
            { Name: "Color", DisplayName: "Color" },
            { Name: "Mileage", DisplayName: "Mileage" },
            { Name: "PurchaseDate", DisplayName: "Purchase Date" },
            { Name: "LotDate", DisplayName: "Lot Date" },
            { Name: "PurchasedAgoDays", DisplayName: "Purchased" },
            { Name: "OnSaleAgoDays", DisplayName: "On Sale" },
            { Name: "RetailCost", DisplayName: "RetailCost" },
            { Name: "Brand.Description", DisplayName: "Title Brand" },
            { Name: "TitStatus", DisplayName: "Title Status" },
            { Name: "TitleStatus.Name", DisplayName: "Car Status" },
            { Name: "SoldDate", DisplayName: "Sold Date" },
            { Name: "SoldCost", DisplayName: "Sold Price" },
            { Name: "DealStatus", DisplayName: "DealStatus" },
            { Name: "Expenses", DisplayName: "Expenses" },
        ];
        $rootScope.$on("TitleStatusTrackingChanged", function () {
            $scope.LoadData();
        });
    }
    $scope.ClearFilter = function (forceLoad) {
        $scope.GridModel.Search = "";
        $scope.GridModel.From = null;
        $scope.GridModel.To = null;
        $scope.GridModel.Skip = 0;
        $scope.GridModel.Take = 100;
        $scope.GridModel.FilterBy = "SoldDate";
        if (forceLoad)
            $scope.Refresh();
    }
   
    $scope.GetDataCore = function (model, tableState) {
        return itemService.GetList(model);
    }
    $scope.DataLoaded = function (result) {
        $scope.TotalsVisible = false;
        $scope.SubTotalsVisible = false;
        $scope.DataLoadedCore(result);
        $scope.DrawTotals();
    }
    $scope.AddNew = function () {
        $window.open(appSettings.Admin_Item_EditSoldUrl, '_blank');
    }
    $scope.DrawTotals = function () {
        if ($scope.HasFilter()) {
            $scope.SubTotalsVisible = true;
        }
        $timeout(function () {
            $scope.IsLoading = true;
            itemService.GetStatisticData($scope.GridModel).then(function (response) {
                if (common.IsValidResponse(response)) {
                    var data = common.ResolveData(response);
                    $scope.Stats = data;
                    $scope.TotalsVisible = true;
                }
            });
        }, 100);

    }
    $scope.EditRow = function (row, newPage) {
        var url = appSettings.Admin_Item_EditSoldUrl + "?id=" + row.Id;
        if (newPage == true)
            $window.open(url, "_blank");
        else {
            $window.location.href = url;
        }
    }
    $scope.DeleteRow = function(row) {
        if (confirm("Delete?")) {
            if (itemService.DeleteItem(row).then(function(result) {
                var data = common.ResolveData(result);
                if (common.IsValidResponse(data) && data.Success) {
                    var index = $scope.VisibleRows.indexOf(row);
                    $scope.VisibleRows.splice(index, 1);
                    common.StopLoadingResponse(data, true, $scope, false);
                } else {
                    common.StopLoadingResponse(data, false, $scope, true);
                }
            }, function(res) {
                var data = common.ResolveData(res);
                common.StopLoadingResponse(data, false, $scope, true);
            }));
        }
    };
    $scope.SetFlags = function (row, flags) {
        itemService.SetFlags(row, flags)
            .then(function (response) {
                var data = common.ResolveData(response);
                if (common.IsValidResponse(data) && data.Success) {
                    row.Flags = data.Entity.Flags;
                }
            });
    }
    $scope.IsSellReady = function (item) {
        return item.IsSellReady;
    }
    $scope.RepairEstimationExpired = function (date) {

	    var now = new Date();

	    var estimatedOn = new Date(date);
	    estimatedOn.setDate(estimatedOn.getDate() + 2 * 7);

	    if (now >= estimatedOn) {
		    return true;
	    }
	    return false;
    }
    $scope.SetSellReady = function (item) {
        var ready = $scope.IsSellReady(item);
        itemService.SetSellReady(item, !ready).then(function (response) {
            var data = common.ResolveData(response);
            if (common.IsValidResponse(data) && data.Success) {
                item.IsSellReady = data.Entity.IsSellReady;
                item.TitleStatusId = data.Entity.TitleStatusId;
                item.TitleStatus = data.Entity.TitleStatus;
            }
        });
    }
    $scope.HasFilter = function () {
        return $scope.GridModel.From != null || $scope.GridModel.To != null || ($scope.GridModel.Search != null && $scope.GridModel.Search != '');
    }
    $scope.IsFlagged = function (row) {
        if ((row.Flags & 1) == 1) {
            return true;
        }
        return false;
    }
    $scope.GetOdometerDef = function (id) {
        return itemService.GetOdometerDef(id);
    }
    $scope.DoInit();
}