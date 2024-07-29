function ControllerBase($controller,
    $rootScope,
    $scope,
    $route,
    $q,
    $location,
    $timeout,
    $filter,
    $window,
    appSession,
    authService,
    notifyService,
    spinnerService,
    ord,
    common,
    appSettings) {

    $scope.IsInitialized = false;
    //Members
    $scope.ValidationRules = [];
    
    $scope.Init = function () {
        if ($scope.InitCore != null)
            $scope.InitCore();
        
    }
    $scope.DoInit=function() {
        if ($scope.IsInitialized == false) {
            $scope.Init();
            $scope.IsInitialized = true;
        }
        
    }
    $scope.AddValidationRule = function (property, messageGetter, validator, type) {
        var rle = {
            Property: property,
            MessageGetter: messageGetter,
            Validator: validator,
            Broken: false,
            Type: type,
        }
        $scope.ValidationRules.push(rle);
    }
    $scope.OpenManufacturersPage = function () {
        $rootScope.AppServices.Session.OpenManufacturersPage($scope);
    }
    $scope.OpenModelsPage = function () {
        $rootScope.AppServices.Session.OpenModelsPage($scope);
    }
    $scope.GoToPublished = function () {
        $rootScope.AppServices.Session.GoToPublished($scope);
    }
    $scope.GoToPartsOnly = function () {
        $rootScope.AppServices.Session.GoToPartsOnly($scope);
    }
    $scope.GoToSold = function () {
        $rootScope.AppServices.Session.GoToSold($scope);
    }
    $scope.OpenTitleStatusesPage = function () {
        $rootScope.AppServices.Session.OpenTitleStatusesPage($scope);
    }
    $scope.OpenItemClientPage = function (itemId) {
        $rootScope.AppServices.Session.OpenItemClientPage(itemId, $scope);
    }
    $scope.OpenCompaniesPage = function () {
        $rootScope.AppServices.Session.OpenCompaniesPage($scope);
    }
    $scope.OpenPartnersPage = function () {
        $rootScope.AppServices.Session.OpenPartnersPage($scope);
    }
    $scope.OpenTitleBrandsPage = function () {
        $rootScope.AppServices.Session.OpenTitleBrandsPage($scope);
    }
    $scope.OpenExpenseTypes = function () {
        $rootScope.AppServices.Session.OpenExpenseTypes($scope);
    }
    $scope.OpenTitleStatusTracking = function (itemId) {
        $rootScope.AppServices.Session.OpenTitleStatusTracking($scope,itemId);
    }
    $scope.PrintBillOfSale = function (row) {
        var w = $window.innerWidth / 2;
        var h = $window.innerHeight;

        var left = ($window.innerWidth / 2) - (w / 2);
        var top = ($window.innerHeight / 2) - (h / 2);
        $window.open(appSettings.Admin_Item_BillOfSaleUrl + "?id=" + row.Id, "Bill Of Sale", "scrollbars=yes,height=" + w + ",width=" + h + ",location=no,left=" + left + ", top=" + top);
    }
    $scope.PrintBillOfSaleCflo = function (row) {
	    var w = $window.innerWidth / 2;
	    var h = $window.innerHeight;

	    var left = ($window.innerWidth / 2) - (w / 2);
	    var top = ($window.innerHeight / 2) - (h / 2);
	    $window.open(appSettings.Admin_Item_BillOfSaleUrl + "cflo?id=" + row.Id, "Bill Of Sale", "scrollbars=yes,height=" + w + ",width=" + h + ",location=no,left=" + left + ", top=" + top);
    }
    $scope.PrintVehicleRepairInvoice = function (row) {
        var w = $window.innerWidth / 2;
        var h = $window.innerHeight;

        var left = ($window.innerWidth / 2) - (w / 2);
        var top = ($window.innerHeight / 2) - (h / 2);
        $window.open(appSettings.Admin_Item_VehicleRepairInvoiceUrl + "?id=" + row.Id, "Vehicle Repair Invoice", "scrollbars=yes,height=" + w + ",width=" + h + ",location=no,left=" + left + ", top=" + top);
    }
    $scope.PrintVehicleRepairInvoiceCflo = function (row) {
	    var w = $window.innerWidth / 2;
	    var h = $window.innerHeight;

	    var left = ($window.innerWidth / 2) - (w / 2);
	    var top = ($window.innerHeight / 2) - (h / 2);
        $window.open(appSettings.Admin_Item_VehicleRepairInvoiceUrl + "cflo?id=" + row.Id, "Vehicle Repair Invoice", "scrollbars=yes,height=" + w + ",width=" + h + ",location=no,left=" + left + ", top=" + top);
    }
    $scope.PrintBillOfSaleInsurance = function (row) {
        var w = $window.innerWidth / 2;
        var h = $window.innerHeight;

        var left = ($window.innerWidth / 2) - (w / 2);
        var top = ($window.innerHeight / 2) - (h / 2);
        $window.open(appSettings.Admin_Item_BillOfSaleInsuranceUrl + "?id=" + row.Id, "Bill Of Sale(Insurance)", "scrollbars=yes,height=" + w + ",width=" + h + ",location=no,left=" + left + ", top=" + top);
    }
    $scope.PrintBillOfSaleInsuranceCflo = function (row) {
	    var w = $window.innerWidth / 2;
	    var h = $window.innerHeight;

	    var left = ($window.innerWidth / 2) - (w / 2);
	    var top = ($window.innerHeight / 2) - (h / 2);
        $window.open(appSettings.Admin_Item_BillOfSaleInsuranceUrl + "cflo?id=" + row.Id, "Bill Of Sale(Insurance)", "scrollbars=yes,height=" + w + ",width=" + h + ",location=no,left=" + left + ", top=" + top);
    }
    $scope.PrintOdisloserCflo = function (row) {
	    var w = $window.innerWidth / 2;
	    var h = $window.innerHeight;

	    var left = ($window.innerWidth / 2) - (w / 2);
	    var top = ($window.innerHeight / 2) - (h / 2);
        $window.open(appSettings.Admin_Item_Odocloser + "cflo?id=" + row.Id, "Adometer Discloser", "scrollbars=yes,height=" + w + ",width=" + h + ",location=no,left=" + left + ", top=" + top);
    }
    $scope.PrintOdisloser = function (row) {
        var w = $window.innerWidth / 2;
        var h = $window.innerHeight;

        var left = ($window.innerWidth / 2) - (w / 2);
        var top = ($window.innerHeight / 2) - (h / 2);
        $window.open(appSettings.Admin_Item_Odocloser + "?id=" + row.Id, "Adometer Discloser", "scrollbars=yes,height=" + w + ",width=" + h + ",location=no,left=" + left + ", top=" + top);
    }
   
    $scope.PrintDealerRegPlatePermit = function (row) {
        var w = $window.innerWidth / 2;
        var h = $window.innerHeight;

        var left = ($window.innerWidth / 2) - (w / 2);
        var top = ($window.innerHeight / 2) - (h / 2);
        $window.open(appSettings.Admin_Item_DealerRegPlatePermitUrl + "?id=" + row.Id, "Dealer Registration Plate Permit", "scrollbars=yes,height=" + w + ",width=" + h + ",location=no,left=" + left + ", top=" + top);
    }
    $scope.PrintDealerRegPlatePermitCflo = function (row) {
	    var w = $window.innerWidth / 2;
	    var h = $window.innerHeight;

	    var left = ($window.innerWidth / 2) - (w / 2);
	    var top = ($window.innerHeight / 2) - (h / 2);
        $window.open(appSettings.Admin_Item_DealerRegPlatePermitUrl + "cflo?id=" + row.Id, "Dealer Registration Plate Permit", "scrollbars=yes,height=" + w + ",width=" + h + ",location=no,left=" + left + ", top=" + top);
    }
    $scope.PrintBuyerGuide = function (row) {
        var w = $window.innerWidth / 2;
        var h = $window.innerHeight;

        var left = ($window.innerWidth / 2) - (w / 2);
        var top = ($window.innerHeight / 2) - (h / 2);
        $window.open(appSettings.Admin_Item_BuyerGuideUrl + "?id=" + row.Id, "Buyer Guide", "scrollbars=yes,height=" + w + ",width=" + h + ",location=no,left=" + left + ", top=" + top);
    }

    $scope.PrintBuyerGuideCflo = function (row) {
	    var w = $window.innerWidth / 2;
	    var h = $window.innerHeight;

	    var left = ($window.innerWidth / 2) - (w / 2);
	    var top = ($window.innerHeight / 2) - (h / 2);
        $window.open(appSettings.Admin_Item_BuyerGuideUrl + "cflo?id=" + row.Id, "Buyer Guide", "scrollbars=yes,height=" + w + ",width=" + h + ",location=no,left=" + left + ", top=" + top);
    }
}