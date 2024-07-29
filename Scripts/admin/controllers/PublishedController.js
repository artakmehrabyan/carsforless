function PublishedController(
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
        
       
        $scope.GridModel.OrderBy = "LotDate";
        $scope.GridModel.OrderDirection = "Desc";
        $scope.GridModel.DocType = 1;
        $scope.GridModel.FilterBy = "PurchaseDate";
        $scope.GridModel.Skip = 0;
        $scope.GridModel.Take = 500;

        $scope.FilterByList = ["PurchaseDate", "LotDate"];
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
            { Name: "PurchaseDate", DisplayName: "PurchaseDate" },
            { Name: "LotDate", DisplayName: "LotDate" },
            { Name: "PurchasedAgoDays", DisplayName: "Purchased" },
            { Name: "OnSaleAgoDays", DisplayName: "On Sale" },
            { Name: "RetailCost", DisplayName: "RetailCost" },
            { Name: "Brand.Description", DisplayName: "Title Brand" },
            { Name: "TitStatus", DisplayName: "Title Status" },
            { Name: "TitleStatus.Name", DisplayName: "Car Status" },
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
        $scope.GridModel.FilterBy = "PurchaseDate";
        if (forceLoad)
            $scope.Refresh();
    }
    $scope.GetDataCore = function (model, tableState) {
        $scope.TotalsVisible = false;
        $scope.SubTotalsVisible = false;
        return itemService.GetList(model);
    }
    $scope.DataLoaded = function (result) {
        $scope.DataLoadedCore(result);
        $scope.DrawTotals();
    }
    $scope.AddNew = function () {
        $window.open(appSettings.Admin_Item_EditPublishedUrl, "_blank");
    }
    $scope.DrawTotals = function () {
        if ($scope.HasFilter()) {
            $scope.SubTotalsVisible = true;
        }
        $timeout(function () {
            itemService.GetStatisticData($scope.GridModel).then(function (response) {
                if (common.IsValidResponse(response)) {
                    var data = common.ResolveData(response);
                    $scope.Stats = data;
                    $scope.TotalsVisible = true;
                }
            });
        }, 500);
    }
    $scope.EditRow = function (row, newPage) {
        var url = appSettings.Admin_Item_EditPublishedUrl + "?id=" + row.Id;
        if (newPage == true)
            $window.open(url, "_blank");
        else {
            $window.location.href = url;
        }
    }
    
    $scope.DeleteRow = function (row) {
        if (confirm("Delete?")) {
            if (itemService.DeleteItem(row).then(function (result) {
                var data = common.ResolveData(result);
                if (common.IsValidResponse(data) && data.Success) {
                    var index = $scope.VisibleRows.indexOf(row);
                    $scope.VisibleRows.splice(index, 1);
                    common.StopLoadingResponse(data, true, $scope, false);
            } else {
                    common.StopLoadingResponse(data, false, $scope, true);
            }
            }, function (res) {
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
    $scope.HasFilter=function() {
        return $scope.GridModel.From != null || $scope.GridModel.To != null || ($scope.GridModel.Search != null && $scope.GridModel.Search != '');
    }
    $scope.IsFlagged = function(row) {
        if ((row.Flags & 1) == 1) {
            return true;
        }
        return false;
    };
    $scope.RepairEstimationExpired = function (date) {
	    
        var now = new Date();

        var estimatedOn = new Date(date);
        estimatedOn.setDate(estimatedOn.getDate() + 2 * 7);

        if (now >= estimatedOn) {
	        return true;
        }
        return false;
    }
    $scope.GetOdometerDef=function(id) {
        return itemService.GetOdometerDef(id);
    }
    $scope.DoInit();
}