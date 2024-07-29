function CarListController(
    $q,
    $http,
    $scope,
    $window,
    $filter,
    $timeout,
    authService,
    appSession,
    appSettings,
    notifyService,
    spinnerService,
    common,
    itemService,
    req) {
    $scope.Options.Notification.ShowAsPopup = true;
    $scope.View = "list-view";
    $scope.Years = [];
    $scope.Colors = [];
    $scope.Pages = [];
    $scope.Damages = [];
    $scope.Model = null;
    $scope.Data = [];
    $scope.VisibleData = [];
    $scope.Page = 0;
    $scope.TotalPages = 0;
    $scope.Title = "Cars";
    $scope.Init = function () {
        $scope.Damages.push({
            Id: 1,
            Name: "None"
        });
        $scope.Damages.push({
            Id: 2,
            Name: "Recovery from Minor Water Damage"
        });
        $scope.Damages.push({
            Id: 3,
            Name: "Recovery from Minor Accident"
        });
        $scope.Damages.push({
            Id: 4,
            Name: "Recovery from Accident"
        });
        $scope.Damages.push({
            Id: 5,
            Name: "Recovery from Theft"
        });
        $scope.Model = {
            DocType: 1,
            Make: '',
            Model: '',
            Color: '',
            MinPrice: null,
            MaxPrice: null,
            MinMileage: null,
            MaxMileage: null,
            MinYear: null,
            MaxYear: null,
            Take: 240,
            Skip: 0,
            OrderBy: 'Make',
        }

       /* $scope.$watch("Model", function (newValue, oldValue) {
            if (oldValue != newValue && newValue != '') {
                $scope.GoTo($scope.Page);
            }
        }, true);*/
        $scope.$watch("Model.Make", function (newValue, oldValue) {
            if (oldValue != newValue && newValue != '') {
                $scope.Models = $filter('filter')($scope.AllModels, function (item) {
                    return item.ManufacturerName === newValue;
                });
            }
        });
        $scope.$watch("Model.Take", function (newValue, oldValue) {
            if (oldValue != newValue && newValue != '') {
                $scope.GoTo($scope.Page);
            }
        });
        var date = new Date();
        var counter = 0;
        for (var i = 1960; i <= date.getFullYear() ; i++) {
            $scope.Years[counter] = i;
            counter++;
        }
        $scope.Colors = itemService.GetColors();
        $q.all([
            itemService.GetManufacturers(),
            itemService.GetModels()]).then(function (results) {
                $scope.Manufacturers = common.ResolveData(results[0]);
                $scope.AllModels = common.ResolveData(results[1]);
            });
       
        if (common.GetQueryStringValue("search")=='damaged') {
            $scope.Title = "Coming Soon";
        }
    }
    $scope.GetDamageType = function (item) {
        var name = "";
        angular.forEach($scope.Damages, function(it) {
            if (it.Id === item.Id)
                name= it.Name;
        });
        return name;
    }
    $scope.GoTo = function(page) {
        var search = common.GetQueryStringValue("search");
        if (search != null) {
            $scope.Model.Search = search;
        }
        var make = common.GetQueryStringValue("Make");
        if (make != null) {
            $scope.Model.Make = make;
        }
        var model = common.GetQueryStringValue("Model");
        if (model != null) {
            $scope.Model.Model = model;
        }
        var color = common.GetQueryStringValue("Color");
        if (color != null) {
            $scope.Model.Color = color;
        }
        var minPrice = common.GetQueryStringValue("MinPrice");
        if (minPrice != null) {
            $scope.Model.MinPrice = minPrice;
        }
        var maxPrice = common.GetQueryStringValue("MaxPrice");
        if (maxPrice != null) {
            $scope.Model.MaxPrice = maxPrice;
        }
        var minMiles = common.GetQueryStringValue("MinMileage");
        if (minMiles != null) {
            $scope.Model.MinMileage = minMiles;
        }
        var maxMiles = common.GetQueryStringValue("MaxMileage");
        if (maxMiles != null) {
            $scope.Model.MaxMileage = maxMiles;
        }
        var minYear = common.GetQueryStringValue("MinYear");
        if (minYear != null) {
            $scope.Model.MinYear = minYear;
        }
        var maxYear = common.GetQueryStringValue("MaxYear");
        if (maxYear != null) {
            $scope.Model.MaxYear = maxYear;
        }
        $scope.Page = page;
        $scope.Model.Skip = ($scope.Page - 1) * $scope.Model.Take;
        $scope.Loading = true;
        var result = $scope.LoadData().then(function () {
            $scope.Loading = false;
            var limit = $scope.TotalPages >= 3 ? 3 : $scope.TotalPages;
            for (var i = 0; i < limit; i++) {
                if ($scope.Page > 3) {
                    $scope.Pages[i] = {
                        Text: $scope.Page - (2 - i),
                        Page: $scope.Page - (2 - i),
                        IsCurrent: $scope.Page - (2 - i) == $scope.Page,
                    }
                } else {
                    $scope.Pages[i] = {
                        Page: i + 1,
                        Text: i + 1,
                        IsCurrent: $scope.Page - (i + 1) == 0,
                    }
                }
            }
            App.Cars.Init();
            
        });
        spinnerService.during(result);
        return result;

    }
    
    $scope.LoadData = function () {
        $scope.VisibleData = [];
        var result = itemService.FindItems($scope.Model).then(function(response) {
            var resp = common.ResolveData(response);
            common.CopyToArray(resp.Paged, $scope.Data);
            $scope.TotalPages = resp.TotalPages;
            if ($scope.VisibleData.length == 0) {
                $scope.loadMore();
            }
        });
        return result;
    }
    $scope.loadMore = function () {
        //var last = $scope.VisibleData.length;
        //var limit = last + 5;
        //if (limit > $scope.Data.length)
        //    limit = $scope.Data.length;
        //for (var i = last; i < limit; i++) {
        //    $scope.VisibleData.push($scope.Data[i]);
        //}
        $scope.AppServices.Common.LoadMore($scope.Data, $scope.VisibleData, 5);
    }
    $scope.ClearAll=function() {
        $scope.Model = {
            DocType: 1,
            Make: '',
            Model: '',
            Color: '',
            MinPrice: null,
            MaxPrice: null,
            MinMileage: null,
            MaxMileage: null,
            MinYear: null,
            MaxYear: null,
            Take: 240,
            Skip: 0,
            OrderBy: 'Make',
        }
        $scope.Search();
    }
    $scope.GetTemplate=function() {
        return "t-" + $scope.View;
    }
    $scope.SetView=function(view) {
        $scope.View = view;
    }
    $scope.Init();
    $scope.GoTo(1);
    
    $scope.Search=function() {
        $scope.GoTo($scope.Page).then(function() {
        });
    }
}