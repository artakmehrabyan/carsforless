function PlateTruckingController(
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

    $scope.Years = [];
    $scope.Statuses = [];
    $scope.Statuses.push({
        Id: 1,
        Name: "Unknown"
    });
    $scope.Statuses.push({
        Id: 2,
        Name: "In house"
    });
    $scope.Statuses.push({
        Id: 3,
        Name: "Given To Customer"
    });
    $scope.Statuses.push({
        Id: 4,
        Name: "Lost"
    });
    $scope.Statuses.push({
        Id: 5,
        Name: "Test Drive"
    });
    $scope.Statuses.push({
        Id: 6,
        Name: "Returned"
    });
    
    $scope.GetStatusText = function (st) {
        var text = "";
        angular.forEach($scope.Statuses, function(s) {
            if (s.Id == st) {
                text= s.Name;
            }
        });
        return text;
    }
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
        var date = new Date();
        var counter = 0;
        for (var i = 1960; i <= date.getFullYear() ; i++) {
            $scope.Years[counter] = i;
            counter++;
        }
        $q.all([
            itemService.GetManufacturers(),
            itemService.GetModels(),
        ]).then(function (results) {
            $scope.Manufacturers = common.ResolveData(results[0]);
            $scope.AllModels = common.ResolveData(results[1]);
        });
        $scope.GridModel.OrderBy = "GivenDate";
        $scope.GridModel.OrderDirection = "Desc";
        $scope.GridModel.Take = 10000;
        $scope.GridModel.VirtualLoad = true;
        $scope.GridModel.VirtualLoadPageSize = 50;
        $rootScope.$on("ManufacturerChange", function (ev, args) {
            $scope.LoadManufacturers();
        });
        $rootScope.$on("ModelChange", function () {
            $scope.LoadModels();
        });

    }

    $scope.GetDataCore = function (model, tableState) {
        return itemService.GetPlateTruckings(model);
    }
    $scope.DataLoaded = function (result) {

        $scope.DataLoadedCore(result);

        $scope.DrawTotals();
    }
    $scope.MakeChanged = function (row) {
        $scope.SelectAccordingModel(row.MakeId);
    }
    $scope.FeesChanged = function (row) {
        row.FeesOutstanding = row.Fees - row.FeesPaid;
    }
    $scope.FeesPaidChanged = function (row) {
        row.FeesOutstanding = row.Fees - row.FeesPaid;
    }
    $scope.FeesOutstandingChanged = function (row) {
        
    }
    $scope.CreateNewRow = function () {
        var row = {
            No: '',
            Status: 2,
            IsNew:true,
            Adding:true,
            Description:"",
            GivenTo:"",
            Address:"",
            ContactInfo:"",
            MakeId:null,
            ModelId:null,
            Year:2016,
            GivenDate:null,
            ExpectedDate:null,
            ReturnDate:null,
            DaysLate: null,
            Comments: null
        };
       
        return row;
    }
    $scope.ValidateRowCore = function (row) {
        var isValid = true;
        isValid = !$scope.plateTruckingForm.$invalid;
        if (row != null) {
            if (row.Status == null || row.Status == '') {
                isValid = false;
            }
            if (row.No== null || row.No == '') {
                isValid = false;
            }
        }
        return isValid;
    }
    $scope.SelectAccordingModel = function (make) {
        $scope.Models = $filter("filter")($scope.AllModels, function (item) {
            var v = item.ManufacturerId == make;
            return v;
        });
    }
    $scope.LoadManufacturers = function () {
        itemService.GetManufacturers().then(function (resp) {
            var data = common.ResolveData(resp);
            $scope.Manufacturers = data;
        });
    }
    $scope.LoadModels = function () {
        itemService.GetModels().then(function (resp) {
            var data = common.ResolveData(resp);
            $scope.AllModels = data;
        });
    }
    $scope.OnStatusChanged=function(row) {
        row.Description = $scope.GetStatusText(row.Status);
    }
    $scope.SaveCore = function (changes) {
        var deferred = $q.defer();
        itemService.SavePlateTruckings(changes)
            .then(function (response) {
                var data = common.ResolveData(response);
                if (data.Success == true) {
                    $scope.Broadcast();
                } 
                deferred.resolve(response);
            },function(res) {
                deferred.reject(res);
            });
        return deferred.promise;
    }
    $scope.Broadcast = function () {
        if (window.$windowScope != null) {
            window.$windowScope.$root.$broadcast("PlateTruckingChange", null);
        }
    }
    $scope.DrawTotals = function () {
        $timeout(function () {
            itemService.GetPlateTruckingStats({}).then(function (response) {
                if (common.IsValidResponse(response)) {
                    var data = common.ResolveData(response);
                    angular.forEach($scope.Statuses, function(s) {
                        var found = data.CountByStatus.filter(function (st) { return st.Key === s.Id });
                        if(found.length>0)
                        s.Count = found[0].Value;
                    });
                }
            });
        }, 500);
    }

    $scope.DoInit();
}