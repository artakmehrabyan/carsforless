function OrderListControllerBase(
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
    appSettings,
    resources) {

    $scope.Statuses = [];
    $scope.LoadServices = function () {
        var model = {
            OrderBy: "Value",
            OrderDirection: "Asc"
        };
        var promise = ord.GetServices(model).then(function (response) {
            var data = common.ResolveData(response);
            if (common.IsValidResponse(data)) {
                $scope.Services = data;
                common.StopLoading(data.Message, true, $scope);
            } else {
                common.StopLoadingResponse(data, false, $scope);
            }
        });
        return promise;
    }
    $scope.InitCore = function () {
        $scope.Statuses.push({ Value: null, Text: "orderstatus_all", IconCss: "fa fa-list" });
        $scope.Statuses.push({ Value: -1, Text: "orderstatus_failed", IconCss: "fa fa-exclamation-triangle" });
        $scope.Statuses.push({ Value: 0, Text: "orderstatus_pending", IconCss: "fa fa-pause" });
        $scope.Statuses.push({ Value: 1, Text: "orderstatus_inprocess", IconCss: "fa fa-spinner" });
        $scope.Statuses.push({ Value: 2, Text: "orderstatus_refunded", IconCss: "fa fa-arrow-left" });
        $scope.Statuses.push({ Value: 3, Text: "orderstatus_canceled", IconCss: "fa fa-ban" });
        $scope.Statuses.push({ Value: 4, Text: "orderstatus_completed", IconCss: "fa fa-check" });
        $scope.LoadServices();
        $scope.$on("OrderAdded", function (e, d) {
            $scope.Refresh();
        });
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
        ord: ord,
        common: common,
        appSettings: appSettings,
    });

    $scope.GetDataCore = function (model, tableState) {
        if ($scope.SelectedService != null) {
            model.ServiceId = $scope.SelectedService.Id;
            model.ServiceValue = $scope.SelectedService.Value;
            model.ActionId = $scope.SelectedAction.Id;
            model.ActionValue = $scope.SelectedAction.Value;
        }
        var deferred = $q.defer();
        ord.GetOrdersPaged(model).then(
            function (response) {
                deferred.resolve(response);
            },
            function (response) {
                deferred.reject(response);
            });

        return deferred.promise;
    }

    $scope.SetActiveService = function (value) {
        $scope.SelectedService = value;
        angular.forEach($scope.Services, function (item) {
            item.Selected = false;
        });
        value.Selected = true;
    }
    $scope.SetActiveAction = function (value) {
        $scope.SelectedAction = value;
        angular.forEach($scope.SelectedService.Actions, function (item) {
            item.Selected = false;
        });
        value.Selected = true;
    }
    $scope.SetActiveStatus = function (value) {
        $scope.GridModel.OrderStatus = value.Value;
        angular.forEach($scope.Statuses, function (item) {
            item.Selected = false;
        });
        value.Selected = true;
    }

    $scope.GetProgressTemplate = function () {
        return "progressTemplate";
    }
    $scope.LoadProgressInfo = function (row) {
        if (row.GainedPercent != null && row.GainedCss != null)
            return;

        var info = ord.GetGainedInfo(row);
        row.GainedPercent = info.Percent;
        row.GainedCss = info.Css;
    }
    $scope.CancelOrder = function (order) {
        var deferred = $q.defer();
        resources.Get(resource.CancelOrderQuestion).then(function (translation) {
            common.Confirm(translation, function () {
                common.StartLoading($scope);
                ord.CancelOrder(order.OrderId).then(
                    function (response) {
                        var data = common.ResolveData(response);
                        common.StopLoadingResponse(response, data.Success, $scope);
                        if (common.IsValidResponse(data) && data.Success) {
                            order.Status = data.Entity.Status;
                            order.StatusText = data.Entity.StatusText;
                            resources.Get(resources.OrderCanceled).then(function(translation) {
                                notifyService.info(translation);
                            });
                            
                            deferred.resolve(response);
                        }
                        else if ($scope.Message != null) {
                            notifyService.error($scope.Message);
                        }
                    },
                    function (response) {
                        common.StopLoadingResponse(response, false, $scope);
                        deferred.reject(response);
                    });
            });
        });
        return deferred.promise;
    }
    $scope.DisplayTotals = function () {
        var promise = ord.GetOrderStats($scope.GridModel)
            .then(function (response) {
                var data = common.ResolveData(response);
                if (common.IsValidResponse(data)) {
                    $scope.Totals = data;
                    common.StopLoadingResponse(response, true, $scope);
                } else {
                    common.StopLoadingResponse(response, false, $scope);
                }
            });
        return promise;
    };
    $scope.AddNew = function () {
        common.GoToRelativeUrl(appSettings.Client_Order_AddOrder_Url);
    };

}

