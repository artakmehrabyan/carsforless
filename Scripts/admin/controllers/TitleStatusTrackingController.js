function TitleStatusTrackingController(
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
    itemService,
    accountService) {

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
    $scope.Statuses = [];
    $scope.Item = {};
    $scope.ItemId = null;
    $scope.Init = function () {
        $scope.NewRowPosition = "top";
        $scope.ItemId = common.GetQueryStringValue("itemId"),
        $scope.InitCore();
        $scope.Statuses.push({
            Id: 1,
            Name: "Ready"
        });
        $scope.Statuses.push({
            Id: 2,
            Name: "Not Ready"
        });
        $scope.Statuses.push({
            Id: 3,
            Name: "In Process"
        });
        $scope.Statuses.push({
            Id: 4,
            Name: "Lost"
        });
        $scope.Statuses.push({
            Id: 5,
            Name: "Unknown"
        });
        $scope.Statuses.push({
            Id: 6,
            Name: "Reinstated"
        });
        $scope.Statuses.push({
            Id: 7,
            Name: "Flipped"
        });
        $scope.Statuses.push({
            Id: 8,
            Name: "InTransit"
        });
        $scope.GridModel.OrderBy = "CreatedOn";
        $scope.GridModel.OrderDirection = "Desc";
        $scope.GridModel.VirtualLoad = true;
        $scope.GridModel.VirtualLoadPageSize = 50;
        accountService.GetUsers().then(function (response) {
            var data = common.ResolveData(response);
            if (common.IsValidResponse(data)) {
                $scope.GivenByList = data.Set;
            }
        });
    }

    $scope.ImmediateSave = false;

    $scope.LoadItemData = function () {
        if ($scope.ItemId != null && $scope.ItemId != '') {
            itemService.GetItem($scope.ItemId).then(function (response) {
                var data = common.ResolveData(response);
                if (common.IsValidResponse(data) && data.Success == true) {
                    common.CopyTo(data.Entity, $scope.Item, false);
                    common.StopLoadingResponse(response, true, $scope, false);
                } else {
                    common.StopLoadingResponse(response, false, $scope, true);
                }

            }, function (response) {
                common.StopLoadingResponse(response, true, $scope, true);
            });
        }
    }
    $scope.GetDataCore = function (model, tableState) {
        model.ItemId = $scope.ItemId;
        return itemService.GetTitleStatusTrackings(model);
    }
    $scope.DataLoaded = function(data) {
        $scope.DataLoadedCore(data);
        $scope.LoadItemData();
    }
    $scope.CreateNewRow = function () {
        var row = {
            Id: 0,
            ItemId: common.GetQueryStringValue("itemId"),
            Status: $scope.Item.TitStatus,
            CreatedOn:new Date(),
            Location: '',
            Comments: '',
            IsNew: true,
            Adding: true,
            Editing: true,
        };
        return row;
    }
    $scope.ValidateRowCore = function (row) {
        var isValid = true;
        if ($scope.titleStatusTrackingForm.$invalid)
            return false;
        if (row != null) {
            if (row.Location == null || row.Location == "") {
                isValid = false;
            }
            if (row.GivenById == null || row.GivenById == null) {
                isValid = false;
            }
        }
        return isValid;
    }
    $scope.OnGivenByChanged = function (row) {
        var givenBy;
        for (var i = 0, len = $scope.GivenByList.length; i < len; i++) {
            var value = $scope.GivenByList[i];
            if (value.Id == row.GivenById) {
                givenBy = value;
                break;
            }
        }
        if (givenBy != null) {
            row.GivenBy = givenBy.UserName;
        }
    }
    $scope.SaveCore = function (changes) {
        var deferred = $q.defer();
        itemService.SaveTitleStatusTrackings(changes)
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
            window.$windowScope.$root.$broadcast("TitleStatusTrackingChanged", null);
        }
    }
    $scope.DoInit();
}