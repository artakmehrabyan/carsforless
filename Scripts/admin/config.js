var admin = angular.module("admin", ["core", "angularFileUpload", "inspinia", "as.sortable", "ui.codemirror","angular.chosen"]);

//Controllers
admin.controller("AdminController", AdminController);
admin.controller("CarOptionsController", CarOptionsController);
admin.controller("CompanyListController", CompanyListController);
admin.controller("ManufacturersController", ManufacturersController);
admin.controller("ModelsController", ModelsController);
admin.controller("TitleStatusListController", TitleStatusListController);
admin.controller("ExpenseTypesController", ExpenseTypesController);
admin.controller("TitleBrandsController", TitleBrandsController);
admin.controller("WarrantiesController", WarrantiesController);
admin.controller("InventoryPartSaleController", InventoryPartSaleController);

admin.controller("PublishedController", PublishedController);
admin.controller("PublishedEditController", PublishedEditController);
admin.controller("PublishedExpensesController", PublishedExpensesController);
admin.controller("ItemPaymentController", ItemPaymentController);
admin.controller("ItemOptionsController", ItemOptionsController);
admin.controller("ItemImagesController", ItemImagesController);
admin.controller("ItemIssuesController", ItemIssuesController);
admin.controller("SoldController", SoldController);
admin.controller("BillOfSaleController", BillOfSaleController);
admin.controller("BuyerGuideController", BuyerGuideController);
admin.controller("OdiscloserController", OdiscloserController);
admin.controller("SoldEditController", SoldEditController);
admin.controller("PartsOnlyController", PartsOnlyController);
admin.controller("ArchivedController", ArchivedController);
admin.controller("PlateTruckingController", PlateTruckingController);
admin.controller("AccountController", AccountController);
admin.controller("AccountRolesController", AccountRolesController);
admin.controller("PasswordChangeController", PasswordChangeController);
admin.controller("UsersController", UsersController);
admin.controller("ItemImageEditController", ItemImageEditController);
admin.controller("TitleStatusTrackingController", TitleStatusTrackingController);
admin.controller("TitleStatusDueController", TitleStatusDueController);
admin.controller("PartnersController", PartnersController);
admin.controller("SqlController", SqlController);
admin.controller("VehicleRepairInvoice", VehicleRepairInvoice);




//admin.config(function($routeProvider,$locationProvider) {
//    $routeProvider
//        .when('/admin/item/editpublished', {
//            templateUrl: "/admin/item/imagespartial",
//            controller: "ItemImagesController"
//        })
//        .when('/item/editpublished', {
//            templateUrl: "/admin/item/imagespartial",
//            controller: "ItemImagesController"
//        })
//        .when('/item/editpublished/auction', {
//            templateUrl: "/admin/item/imagespartial",
//            controller: "ItemImagesController"
//        });
    
//    $locationProvider.html5Mode(true);
//});