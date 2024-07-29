function carFilterController($q, $http, $scope, $window, $filter, $timeout, authService, appSession, appSettings, notifyService, spinnerService, common, itemService, req) {
    $scope.Years = [];
    $scope.Colors = [];
    $scope.Pages = [];
    $scope.Model = null;
    $scope.Data = [];
    $scope.Init = function () {
        $scope.Model = {
            DocType: 1,
            Make: "",
            Model: "",
            Color: "",
            MinPrice: null,
            MaxPrice: null,
            MinMileage: null,
            MaxMileage: null,
            MinYear: null,
            MaxYear: null,
            Take: 240,
            Skip: 0,
            OrderBy: "Make"
        }
        $scope.$watch("Model.Make", function (newValue, oldValue) {
            if (oldValue != newValue && newValue != '') {
                $scope.Models = $filter('filter')($scope.AllModels, function (item) {
                    return item.ManufacturerName === newValue;
                });
            }
        });
        $scope.$watch("Model.Take", function (newValue, oldValue) {
            if (oldValue != newValue && newValue != '') {
                
            }
        });
        var date = new Date();
        var counter = 0;
        for (var i = 1960; i <= date.getFullYear(); i++) {
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
    };
    
   
    $scope.ClearAll = function () {
        $scope.Model = {
            DocType: 1,
            Make: "",
            Model: "",
            Color: "",
            MinPrice: null,
            MaxPrice: null,
            MinMileage: null,
            MaxMileage: null,
            MinYear: null,
            MaxYear: null,
            Take: 240,
            Skip: 0,
            OrderBy: "Make",
        };
    };
    $scope.Cancel=function() {
        common.GoTo(appSettings.Client_Item_List_Url);
    }
    $scope.Apply = function () {
        var str = $.param($scope.Model);
        common.GoTo(appSettings.Client_Item_List_Url+"?"+str);
    };

    $scope.Init();
}
