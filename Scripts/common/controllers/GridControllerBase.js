function GridControllerBase(
    $controller,
    $rootScope,
    $scope,
    $route,
    $q,
    $location,
    $timeout,
    $filter,
    appSession,
    authService,
    notifyService,
    spinnerService,
    ord,
    common,
    appSettings) {

    $scope.VisibleRows = [];
    $scope.TotalCount = 0;
    $scope.tableState = null;
    $scope.PageSizes = [100, 200, 500, 1000, 2000];
    $scope.GridModel = {
        Search: "",
        Skip: 0,
        Take: 100,
        OrderBy: "CreatedOn",
        OrderDirection: "Desc",
        From: null,
        To: null,
        UserId: appSession.GetCurrent().UserId,
        VirtualLoad: false,
        VirtualLoadPageSize: 10,
        PaginationEnabled: true,
    };

    $controller("ControllerBase", {
        $controller: $controller,
        $rootScope: $rootScope,
        $scope: $scope,
        $route: $route,
        $q: $q,
        $location: $location,
        $timeout: $timeout,
        $filter: $filter,
        appSession: appSession,
        authService: authService,
        notifyService: notifyService,
        spinnerService: spinnerService,
        ord: ord,
        common: common,
        appSettings: appSettings,
    });

    $scope.CurrentDate = new Date();
    $scope.Selection =
    {
        AllSelected: false,
        Count: 0,
        Rows: [],
    };
    $scope.InitCore = function () {
        $scope.$watch("Selection.AllSelected", function (newValue, oldValue) {
            if (oldValue != newValue) {
                $scope.SelectAllRows(newValue);
            }
        });
        $scope.$watch("VisibleRows", function (newValue, oldValue) {
            if (oldValue != newValue) {
                if ($scope.VisibleRows.length < 1) {
                    $scope.AllSelected = false;
                }
            }
        });
        var url = common.GetCurrentUrlWithoutQueryString();
        $scope.RestoreState(url);
        
    }
    $scope.Init = function () {
        $scope.InitCore();
    }
    $scope.LoadData = function (tableState) {
        if (tableState != null) {
            $scope.tableState = tableState;
            var pagination = tableState.pagination;

            if (pagination.start != null)
                $scope.GridModel.Skip = pagination.start;
            if (pagination.number != null)
                $scope.GridModel.Take = pagination.number;

            $scope.GridModel.OrderBy = tableState.sort.predicate || $scope.GridModel.OrderBy;
            $scope.GridModel.OrderDirection = tableState.sort.predicate ? (tableState.sort.reverse) ? "Desc" : "Asc" : $scope.GridModel.OrderDirection;
        }
        var currentSession = appSession.GetCurrent();
        $scope.GridModel.UserId = currentSession.UserId;
        if ($scope.GetDataCore != null) {
            //var deferred = $q.defer();
            var promise = $scope.GetDataCore($scope.GridModel, tableState).then(
                function (response) {
                    
                    var data = common.ResolveData(response);

                    if (common.IsValidResponse(data)) {
                        $scope.DataLoaded(data);
                        //deferred.resolve(data);

                    } else {
                        $scope.DataError(response);
                        //deferred.reject(data);
                    }
                }, function (response) {
                    $scope.DataError(response);
                    //deferred.reject(data);
                });
            spinnerService.during(promise);
            return promise;
        }
    };
    $scope.Refresh = function () {
        $scope.LoadData($scope.tableState);
    }
    $scope.DataLoadedCore = function (result) {
        if (result != null) {
            $scope.Rows = result.Paged || result.Set || result;
            if ($scope.GridModel.VirtualLoad) {
                $scope.VisibleRows = [];
                $scope.LoadMoreData($scope.Rows, $scope.VisibleRows, $scope.GridModel.VirtualLoadPageSize);
            }
            else {
                $scope.VisibleRows = angular.copy($scope.Rows);
            }
            common.StopLoading('',true,$scope);
            $scope.TotalCount = $scope.Rows.length;
            $scope.TotalVisibleCount = $scope.VisibleRows.length;
            if ($scope.tableState != null) {
                $scope.tableState.pagination.numberOfPages = result.TotalPages || 1;
            }
            if ($scope.CalculateTotals != null)
                $scope.CalculateTotals(result);

        }
        var url = common.GetCurrentUrlWithoutQueryString();
        
        $scope.SaveState(url);
    };
    $scope.LoadMoreData = function () {
        common.LoadMore($scope.Rows, $scope.VisibleRows, $scope.GridModel.VirtualLoadPageSize);
    }
    $scope.DataLoaded = function (result) {
        $scope.DataLoadedCore(result);
    };
    $scope.DataError = function (response) {
        $scope.OnDataError(response);
    };
    $scope.OnDataError = function (response) {
        common.StopLoadingResponse(response, false, $scope);
    }
    $scope.ClearFilter = function (forceLoad) {
        $scope.GridModel.Search = "";
        $scope.GridModel.From = null;
        $scope.GridModel.To = null;
        $scope.GridModel.Skip = 0;
        $scope.GridModel.Take = 1000;
        if (forceLoad)
            $scope.Refresh();
    }

    //Selection
    $scope.SelectAllRows = function (on) {
        angular.forEach($scope.VisibleRows, function (value, key) {
            if (value.Selected != true && on === true || (value.Selected === true && on === false)) {
                $scope.SelectRow(value);
            }
        });
    }
    $scope.SelectRow = function (row) {
        var idx = $scope.Selection.Rows.indexOf(row);
        if (idx > -1) {
            $scope.Selection.Count--;
            $scope.Selection.Rows.splice(idx, 1);
            row.Selected = false;

        } else {
            row.Selected = true;
            $scope.Selection.Rows.push(row);
            $scope.Selection.Count++;
        }
    };

    $scope.ValidateRow = function (row) {
        var success = true;
        $scope.ValidationRules.forEach(function (rule) {
            if (rule.Validator(row[rule.Property]) == false) {
                if (rule.MessageGetter != null) {
                    if (rule.Type == null || rule.Type == 0) {
                        notifyService.error("", rule.MessageGetter());
                    } else if (rule.Type == 1) {
                        notifyService.warn("", rule.MessageGetter());
                    } else if (rule.Type == 2) {
                        notifyService.info("", rule.MessageGetter());
                    }
                }
                rule.Broken = true;
                success = false;
            }
        });
        if (success) {
            if ($scope.ValidateRowCore != null) {
                success = $scope.ValidateRowCore(row);
            }
        }
        row.IsValid = success;
        return success;
    }
    $scope.RestoreState = function (key) {
        var cacheItem = $rootScope.AppServices.Store.Get(key);
        if (cacheItem != null)
            $scope.GridModel = cacheItem;
    }
    $scope.SaveState = function (key) {
        var cacheItem = $scope.GridModel;
        $rootScope.AppServices.Store.Set(key, cacheItem, { hours: 2 });
    }

    $scope.ExportToCsv = function (title) {
        var fileName = $filter('date')(new Date(), "dd-MM-yyyy");
        common.ExportData(title, fileName + ".csv", $scope.VisibleRows, "csv");
    }
    $scope.ExportToTxt = function (title) {
        var fileName = $filter('date')(new Date(), "dd-MM-yyyy");
        common.ExportData(title, fileName + ".txt", $scope.VisibleRows, "txt");
    }
    $scope.ExportToPdf = function (title) {
        var fileName = $filter('date')(new Date(), "dd-MM-yyyy");
        common.ExportData(title, fileName + ".pdf", $scope.VisibleRows, "pdf");
    }

}
