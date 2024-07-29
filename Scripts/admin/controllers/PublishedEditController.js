function PublishedEditController(
    $controller,
    $rootScope,
    $scope,
    $route,
    notifyService,
    spinnerService,
    itemService,
    appSession,
    appSettings,
    $window,
    $location,
    $filter,
    $q,
    $timeout,
    common,
    companyService,
    api) {

    $scope.Suppliers = [];
    $scope.Years = [];
    $scope.Colors = [];
    $scope.OdometerDefs = [];
    $scope.Damages = [];
    $scope.TitStatuses = [];
    $scope.FloorPlans = [];
    $scope.Options =
    {
        Notification: {
            Message: "",
            Show: false,
        }
    };
    $scope.Affiliates = [];

    $scope.Affiliates.push({
        Value: "www.autoprestigeinc.com;www.autoprestigeimports.com;localhost;www.carsflout.com",
	    Text: "Prestige"
    });
    $scope.Affiliates.push({
	    Value: "www.carsflout.com",
	    Text: "Carsflout"
    });

    $scope.OriginalObject = {};
    $scope.EditableObject = {
	    IsNew: true,
	    TitStatus: "Unknown",
	    OwnershipRatio: 100,
	    Quantity: 1,
	    DocType: 1, //Published
	    TitleStatusId: 6,
	    MediaList: [],
	    Rebuildable: false,
	    Affiliate: [$scope.Affiliates[0].Value]
    //FinanceCharge: 25
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
        notifyService: notifyService,
        spinnerService: spinnerService,
        common: common,
        appSettings: appSettings,
    });

    $rootScope.$on("ManufacturerChange", function (ev, args) {
        $scope.LoadManufacturers();
    });
    $rootScope.$on("ModelChange", function () {
        $scope.LoadModels();
    });
    $rootScope.$on("CompanyChange", function () {
        $scope.LoadSuppliers();
    });
    $rootScope.$on("TitleStatusChange", function () {
        $scope.LoadItemTitleStatuses();
    });
    $rootScope.$on("TitleBrandChange", function () {
        $scope.LoadTitleBrands();
    });
    $rootScope.$on("WarrantyChange", function () {
        $scope.LoadWarranties();
    });
    $rootScope.$on("TitleStatusTrackingChanged", function () {
        $scope.LoadData();
    });
    $scope.SelectAccordingModel = function (make) {
        $scope.Models = $filter("filter")($scope.AllModels, function (item) {
            return item.ManufacturerName === make;
        });
    }
    $scope.Init = function () {
        if ($scope.InitCore != null)
            $scope.InitCore();

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
        $scope.Damages.push({
            Id: 6,
            Name: "Clean"
        });
        $scope.Damages.push({
            Id: 7,
            Name: "Extra  Clean"
        });
        $scope.Damages.push({
            Id: 8,
            Name: "Average"
        });
        $scope.Damages.push({
            Id: 9,
            Name: "Below Average"
        });
        $scope.Damages.push({
            Id: 10,
            Name: "Rough"
        });
        $scope.Damages.push({
            Id: 11,
            Name: "Extra Rough"
        });
        $scope.Damages.push({
            Id: 12,
            Name: "Damaged"
        });
        $scope.OdometerDefs.push({
            Id: 1,
            Name: "Actual"
        });
        $scope.OdometerDefs.push({
            Id: 2,
            Name: "Not Actual"
        });

        //FloorPlans--------------------------------------------------------------------------------
        $scope.FloorPlans.push({
            Id: 0,
            Name: "NONE"
        });
        $scope.FloorPlans.push({
            Id: 1,
            Name: "AFC"
        });
        $scope.FloorPlans.push({
            Id: 2,
            Name: "NGR"
        });
        $scope.FloorPlans.push({
            Id: 3,
            Name: "In House"
        });
        $scope.FloorPlans.push({
            Id: 4,
            Name: "Consignment"
        });
        $scope.FloorPlans.push({
	        Id: 5,
            Name: "PartsSale"
        }); 

        //St--------------------------------------------------------------------------------
        $scope.TitStatuses.push({
            Id: 1,
            Name: "Ready"
        });
        $scope.TitStatuses.push({
            Id: 2,
            Name: "Not Ready"
        });
        $scope.TitStatuses.push({
            Id: 3,
            Name: "In Process"
        });
        $scope.TitStatuses.push({
            Id: 4,
            Name: "Lost"
        });
        $scope.TitStatuses.push({
            Id: 5,
            Name: "Unknown"
        });
        $scope.TitStatuses.push({
            Id: 6,
            Name: "Reinstated"
        });
        $scope.TitStatuses.push({
            Id: 7,
            Name: "Flipped"
        });
        $scope.TitStatuses.push({
            Id: 8,
            Name: "InTransit"
        });
      
        //--------------------------------------------------------------------------------
        var date = new Date();
        var counter = 0;

        for (var i = 1; i <= date.getFullYear() ; i++) {
            $scope.Years[counter] = i;
            counter++;
        }
        $scope.$watch("Selection.AllOptionsSelected", function (newValue, oldValue) {
            if (oldValue != newValue) {
                $scope.SelectAllOptions(newValue);
            }
        }, true);

        $scope.$watch("EditableObject.Make", function (newValue, oldValue) {
            if (oldValue != newValue) {
                $scope.SelectAccordingModel($scope.EditableObject.Make);
            }
        }, true);
        
        $scope.$watch("EditableObject.DisplayInCarList", function (newValue, oldValue) {
            if (oldValue != newValue && newValue == false) {
                $scope.EditableObject.DisplayAtHome = false;
            }
        }, true);
        
        $scope.$watch("EditableObject.DisplayAtHome", function (newValue, oldValue) {
            if (oldValue != newValue && newValue == true && $scope.EditableObject.DisplayInCarList == false) {
                $scope.EditableObject.DisplayInCarList = true;
            }
        }, true);

        
        $scope.Types = itemService.GetTypes();
        $scope.Colors = itemService.GetColors();

        return $q.all([
            itemService.GetManufacturers(),
            itemService.GetModels(),
            companyService.GetSuppliers({
                OrderBy: "Name",
                Take: 10000
            }),
            itemService.GetTitleStatuses(),
            itemService.GetWarranties(),
            itemService.GetTitleBrands()
        ]).then(function (results) {
            $scope.LoadData(),
            $scope.Manufacturers = common.ResolveData(results[0]);
            $scope.AllModels = common.ResolveData(results[1]);
            $scope.Suppliers = common.ResolveData(results[2]);
            $scope.TitleStatuses = common.ResolveData(results[3]);
            $scope.Warranties = common.ResolveData(results[4]);
            $scope.TitleBrands = common.ResolveData(results[5]);

            $scope.SelectTab();

        });


    };
    $scope.CalcFinancePrice = function () {
        if (common.IsNullOrEmpty($scope.EditableObject.FinanceCharge)) {
            $scope.EditableObject.FinancePrice = null;
        } else {
            $scope.EditableObject.FinancePrice = ($scope.EditableObject.RetailCost +
                ($scope.EditableObject.RetailCost * $scope.EditableObject.FinanceCharge / 100)).toFixed(2);
        }
    }
    
    $scope.CalcFinanceCharge = function () {
        if (common.IsNullOrEmpty($scope.EditableObject.FinancePrice)) {
            $scope.EditableObject.FinanceCharge = null;
        } else {
            
            $scope.EditableObject.FinanceCharge =
            ((($scope.EditableObject.FinancePrice - $scope.EditableObject.RetailCost) /
                    $scope.EditableObject.RetailCost) *
                100).toFixed(2);
        }
    }
    $scope.SelectTab = function () {
        var cat = common.GetQueryStringValue("imcat");
        if (cat != null) {
            $timeout(function () {
                $("li a.nav-link").last().click();
            }, 100);
        }
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
            $scope.SelectAccordingModel($scope.EditableObject.Make);
        });
    }
    $scope.LoadSuppliers = function () {
        companyService.GetSuppliers().then(function (resp) {
            var data = common.ResolveData(resp);
            $scope.Suppliers = data.Set;
        });
    }
    $scope.LoadItemTitleStatuses = function () {
        itemService.GetItemTitleStatuses().then(function (resp) {
            var data = common.ResolveData(resp);
            $scope.TitleStatuses = data;
        });
    }
    $scope.LoadTitleBrands = function () {
        itemService.GetTitleBrands().then(function (resp) {
            var data = common.ResolveData(resp);
            $scope.TitleBrands = data;
        });
    }
    $scope.LoadWarranties = function () {
        itemService.GetWarranties().then(function (resp) {
            var data = common.ResolveData(resp);
            $scope.Warranties = data;
        });
    }

    $scope.OnSaving = function (item) {
        return $rootScope.$broadcast("ItemSaving", item);
    }
    $scope.SaveData = function () {
        var url = $scope.EditableObject.IsNew ? appSettings.Api_Item_AddPublishedUrl : appSettings.Api_Item_UpdatePublishedUrl;
        
        $scope.OnSaving($scope.EditableObject);
        if ($scope.EditableObject.IsValid == false)
            return false;
        common.StartLoading($scope, true);

        if ($scope.EditableObject.OwnershipId == null &&
            $scope.EditableObject.Affiliate.indexOf("www.carsflout.com") !=null) {
	        $scope.EditableObject.OwnershipId = 1;
	        $scope.EditableObject.OwnershipRatio = 50;
        }
        api.post(url, $scope.EditableObject)
            .then(function (response) {
                var data = common.ResolveData(response);
                if (common.IsValidResponse(data) && data.Success) {
                    common.CopyTo(data.Entity, $scope.EditableObject, false);
                    common.CopyTo(data.Entity, $scope.OriginalObject, false);
                    
                    if ($scope.EditableObject.IsNew) {
                        $rootScope.$broadcast("ItemLoaded");
                    }//Load new expenses
                    $rootScope.$broadcast("LoadExpenses");
                    $rootScope.$broadcast("LoadIssues");
                    //$rootScope.$broadcast("ItemLoaded");
                    $scope.EditableObject.IsNew = false;
                   
                    common.StopLoadingResponse(response, true, $scope, false);
                    $scope.Options.Notification.Show = true;
                    $scope.Options.Notification.Message = "Successfully saved!";
                    $timeout(function () {
                        $scope.Options.Notification.Show = false;
                    }, 2000);

                }
            }, function (response) {
                common.StopLoadingResponse(response, true, $scope, true);
            });
    }
    $scope.intToString = function (key) {
        return (!isNaN(key)) ? parseInt(key) : key;
    };
    $scope.LoadData = function () {
        var id = common.GetQueryStringValue("id");
        if (id != null && id != '') {
            common.StartLoading($scope, true);
            itemService.GetItem(id).then(function (response) {
                var data = common.ResolveData(response);
                if (common.IsValidResponse(data) && data.Success == true) {
                    common.CopyTo(data.Entity, $scope.EditableObject, false);
                    common.CopyTo(data.Entity, $scope.OriginalObject, false);
                    $rootScope.$broadcast("ItemLoaded");
                    //load expenses
                    $scope.EditableObject.IsNew = false;
                    var docTypeId = common.GetQueryStringValue("doc");
                    if (docTypeId!=null)
                        $scope.EditableObject.DocType = docTypeId;
                    else
                        $scope.EditableObject.DocType = 1;
                    if ($scope.EditableObject.FinancePrice == null) {
                        $scope.CalcFinancePrice();
                    }
                    $scope.CalcFinanceCharge();
                    $scope.EditableObject.MediaLength = Math.round($scope.EditableObject.MediaCount / 3);
                    
                    common.StopLoadingResponse(response, true, $scope, false);
                } else {
                    common.StopLoadingResponse(response, false, $scope, true);
                }

            }, function (response) {
                common.StopLoadingResponse(response, true, $scope, true);
            });
        }
    }
    $scope.MoveToPublished = function (obj) {
        window.location.assign(appSettings.Admin_Item_EditPublishedUrl + "?id=" + obj.Id + "&doc=1");
    }
    $scope.MoveToPartsOnly = function (obj) {
        window.location.assign(appSettings.Admin_Item_EditPublishedUrl + "?id=" + obj.Id + "&doc=3");
    }
    $scope.MoveToSold = function (obj) {
        $window.location.href = appSettings.Admin_Item_EditSoldUrl + "?id=" + obj.Id;
    }
    $scope.MoveToArchived = function (obj) {
        $window.location.href = appSettings.Admin_Item_EditPublishedUrl + "?id=" + obj.Id + "&doc=10";
    }
    $scope.ImportItem = function () {
        if ($scope.EditableObject.IsNew == false)
            return;
        var vin = $scope.EditableObject.Vin;
        itemService.ImportItem(vin).then(function (resp) {
            var data = common.ResolveData(resp);
            if (data.Success) {
                var item = data.Entity;
                var tpe = $scope.Types.filter(function (res) {
                    if (item.Type.toLowerCase() == res.toLowerCase())
                        return true;
                    else
                        return item.Type.toLowerCase().indexOf(res.toLowerCase()) != -1
                });
                var mde = $scope.AllModels.filter(function (res) {
                    if (item.Model.trim().toLowerCase() == res.Name.trim().toLowerCase())
                        return true;
                    else
                        item.Model.trim().toLowerCase().indexOf(res.Name.trim().toLowerCase()) != -1;
                });
                $scope.EditableObject.Year = item.Year;
                $scope.EditableObject.Type = tpe[0] || item.Type;
                $scope.EditableObject.Make = item.Make;
                $scope.EditableObject.Trim = item.Trim;
                $scope.EditableObject.Model = mde[0].Name || item.Model;
                $scope.EditableObject.Comment = "Engine:" + item.Engine + "\r\n" + "Transmission:" + item.Transmission;
            } else {
                notifyService.warn("Import Failed", "Could not import by provided vin number");
            }
        });
    }
    
    $scope.DoInit();

}