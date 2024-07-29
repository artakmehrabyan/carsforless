var core = angular.module("core", ["LocalStorageModule", "ngRoute", ,"ngSanitize","ngAnimate", "smart-table", "ngHelperBusy", "ui.bootstrap", "ngContextMenu", "ngclipboard", "angular-ios-alertview", "infinite-scroll"])
    .constant("keyCodes", {
        esc: 27,
        space: 32,
        enter: 13,
        tab: 9,
        backspace: 8,
        shift: 16,
        ctrl: 17,
        alt: 18,
        capslock: 20,
        numlock: 144
    })
    .constant("appSettings", {
        "serviceUrl": function (location) {
            var host = location.host();
            var url = host.indexOf("localhost") > -1 ? "http://localhost:6947" : "http://" + host;
            return url;
        },
        "CarImagesUrl":"http://cloud-pres.com/media/images/cars",
        /*Client
        --------------------------------------------------------------------------------------*/
        "Client_HomeUrl": "/",
        "Client_Login_Url": "/account/login",
        "Client_LoginOff_Url": "/account/logoff",
        "Client_Register_Url": "/account/register",
        "Client_ForgotPassword_Url": "/account/forgotpassword",
        "Client_ResetPassword_Url": "/account/resetpassword",
        "Client_ItemClient_Url": "/car/details",
        "Client_Item_List_Url": "/car/list",
        "Client_Item_Damaged_Url": "/car/damaged",
        /*Api
        -------------------------------------------------------------------------------------*/
        "Api_Management_ResetCache": "/api/management/resetcache",

        //Company
        "Api_Company_GetListUrl": "/api/company/getlist",
        "Api_Company_GetSuppliersUrl": "/api/company/getsuppliers",
        "Api_Company_GetCustomersUrl": "/api/company/getcustomers",
        "Api_Company_SaveListUrl": "/api/company/savelist",

        //Manufacturer
        "Api_Manufacturer_GetListUrl": "/api/item/getmanufacturers",
        "Api_Manufacturer_SaveUrl": "/api/item/savemanufacturers",
        "Api_Item_GetModelsUrl": "/api/item/getmodels",
        "Api_Item_SaveModelsUrl": "/api/item/savemodels",

        "Api_Item_GetTitleStatusesUrl": "/api/item/gettitlestatuses",
        "Api_Item_SaveTitleStatusesUrl": "/api/item/savetitlestatuses",
        "Api_Item_GetExpenseTypesUrl": "/api/item/getexpensetypes",
        "Api_Item_SaveExpenseTypesUrl": "/api/item/saveexpensetypes",
        "Api_Item_GetTitleBrandsUrl": "/api/item/gettitlebrands",
        "Api_Item_SaveTitleBrandsUrl": "/api/item/savetitlebrands",

        "Api_Item_GetWarrantiesUrl": "/api/item/getwarranties",
        "Api_Item_SaveWarrantiesUrl": "/api/item/savewarranties",
        "Api_Item_GetInventoryPartSalesUrl": "/api/item/getinventorypartsales",
        "Api_Item_GetTitleStatusDueUrl": "/api/item/gettitlestatusdue",

        "Api_Item_SaveInventoryPartSalesUrl": "/api/item/saveinventorypartsales",
        "Api_Item_SaveTitleStatusDueUrl": "/api/item/savetitlestatusdue",

        "Api_Item_GetCarOptionsUrl": "/api/item/getcaroptions",
        "Api_Item_SaveCarOptionsUrl": "/api/item/savecaroptions",
        "Api_Item_GetList": "/api/item/getlist",
        "Api_Item_FindItems": "/api/item/finditems",
        "Api_Item_GetItemUrl": "/api/item/getitem",
        "Api_Item_GetItemsOfBestOfferUrl": "/api/item/getitemsofbestoffer",
        "Api_Item_GetItemsLatestOfferUrl": "/api/item/getitemslatestoffer",
        "Api_Item_GetItemsForHomePageUrl": "/api/item/getitemsforhomepage",
        "Api_Item_GetStatisticsUrl": "/api/item/getstatistics",
        "Api_Item_SetFlagsUrl": "/api/item/setflags",
        "Api_Item_SetSellReadyUrl": "/api/item/setsellready",
        "Api_Item_AddPublishedUrl": "/api/item/addpublished",
        "Api_Item_UpdatePublishedUrl": "/api/item/updatepublished",
        "Api_Item_ImportItemUrl": "/api/item/import",
        "Api_Item_GetPaymentMethodsUrl": "/api/item/getpaymentmethods",
        "Api_Item_GetPaymentTypesUrl": "/api/item/getpaymenttypes",
        "Api_Item_DeleteItemUrl": "/api/item/delete",
        "Api_Item_GetAdsUrl": "/api/item/getads",
        "Api_Item_SetAsMainImageUrl": "/api/item/setasmainimage",
        "Api_Management_GetPartners": "/api/management/getpartners",
        "Api_Management_SavePartners": "/api/management/savepartners",
        "Api_Management_RunSql": "/api/management/runsql",

        "Admin_Item_EditPublishedUrl": "/admin/item/editpublished",
        "Admin_Item_EditSoldUrl": "/admin/item/editsold",
        
        "Admin_Item_UserProfileUrl": "/admin/account/profile",
        "Admin_Item_MakesUrl": "/admin/item/makes",
        "Admin_Item_ModelsUrl": "/admin/item/models",
        "Admin_Item_TitleStatusesUrl": "/admin/item/titlestatuses",
        "Admin_Item_PublishedUrl": "/admin/item/published",
        "Admin_Item_PartsOnlyUrl": "/admin/item/partsonly",
        "Admin_Item_SoldUrl": "/admin/item/sold",
        "Admin_CompanyList_Url": "/admin/company/list",
        "Admin_Management_PartnersUrl": "/admin/management/partners",
        "Admin_Item_TitleBrandsUrl": "/admin/item/titlebrands",
        "Admin_Item_ExpenseTypesUrl": "/admin/item/expensetypes",
        "Admin_Item_DeleteImageUrl": "/admin/item/deleteimage",
        "Admin_Item_BillOfSaleUrl": "/admin/item/billofsale",
        "Admin_Item_DealerRegPlatePermitUrl": "/admin/item/dealerregplatepermit",
        "Admin_Item_BillOfSaleInsuranceUrl": "/admin/item/billofsaleinsurance",
        "Admin_Item_BuyerGuideUrl": "/admin/item/buyerguide",
        "Admin_Item_VehicleRepairInvoiceUrl": "/admin/item/vehiclerepairinvoice",
        "Admin_Item_Odocloser": "/admin/item/odometerdiscloser",
        "Admin_Account_UserProfileUrl": "/admin/account/profile",
        "Admin_Item_ItemImageEditViewUrl": "/admin/item/itemimageeditview",
        "Admin_Item_ItemTitleStatusTrackingUrl": "/admin/item/TitleStatusTracking",

        "Api_Item_GetPlateTruckingsUrl": "/api/item/getplatetruckings",
        "Api_Item_GetPlateTruckingNosUrl": "/api/item/getplatetruckingnos",
        "Api_Item_SavePlateTruckingsUrl": "/api/item/saveplatetruckings",
        "Api_Item_GetPlateTruckingStatsUrl": "/api/item/getplatetruckingstats",
        "Api_Item_GetInventoryPartSaleStatsUrl": "/api/item/getinventorypartsalestats",

        "Api_Item_UpdateMediaUrl": "/api/item/updatemedia",
        "Api_Item_UpdateMediaOrdersUrl": "/api/item/updatemediaorders",
        "Api_Item_SaveTitleStatusTrackingsUrl": "/api/item/savetitlestatustrackings",
        "Api_Item_GetTitleStatusTrackingsUrl": "/api/item/gettitlestatustrackings",

        "Api_Account_GetUrl": "/api/account/get",
        "Api_Account_GetUsersUrl": "/api/account/getusers",
        "Api_Account_GetUsersPagedUrl": "/api/account/getuserspaged",
        "Api_Account_UpdateUrl": "/api/account/update",
        "Api_Account_CreateUrl": "/api/account/create",
        "Api_Account_DeleteUrl": "/api/account/delete",


        "Api_Account_GetRolesUrl": "/api/account/getuserroles",
        "Api_Account_ChangePasswordUrl": "/api/account/changepassword",
        "Api_Account_GetCurrentUserUrl": "/api/account/getcurrentuser",
       
        //CART
        "Api_Item_AddToCart": "/api/item/addtocart",
        "Api_Item_SaveCart": "/api/item/savecart",
        "Api_Item_GetShoppingCartUrl": "/api/item/getshoppingcart",
        "Api_Item_GetShoppingCartListUrl": "/api/item/getshoppingcartlist",
    });



//Directives
core.directive("clickGo", clickGo);
core.directive("datePick", datePick);
core.directive("ngEsc", ngEsc);
core.directive("maxLengthMarker", maxLengthMarker);
core.directive("ngEnter", ngEnter);
core.directive("ngDoFocus", ngDoFocus);
core.directive("editLine", editLine);
core.directive("largeSelect", largeSelect);
core.directive("ngSelectClicked", ngSelectClicked);
core.directive("shortcut", shortcut);
core.directive("stringToNumber", stringToNumber);
core.directive("activeLink", activeLink);
core.directive("ngExForm", ngExForm);
core.directive("ngConvertToNum", ngConvertToNum);
core.directive("isolateClick", isolateClick);


//Services
core.factory("httpRequestInterceptor", HttpRequestInterceptorFactory);
core.factory("ngCartItem", CartItem);
core.service("cart", Cart);
core.service("spinnerService", SpinnerService);
core.service("notifyService", NotificationService);
core.service("authService", AuthenticationService);
core.service("appSession", AppSession);
core.service("common", CommonService);
core.service("api", Api);
core.service("store", Store);


core.provider("sessionContext", SessionContext);

//Controllers
core.controller("ControllerBase", ControllerBase);
core.controller("InlineEditControllerBase", InlineEditControllerBase);
core.controller("GridControllerBase", GridControllerBase);



//Config
core.config(function ($httpProvider) {
    $httpProvider.interceptors.push("httpRequestInterceptor");
});
core.filter("total", function() {
    return function (data, key) {
        if (typeof (data) === 'undefined' || typeof (key) === 'undefined') {
            return 0;
        }

        var sum = 0;
        for (var i = data.length - 1; i >= 0; i--) {
            sum += parseFloat(data[i][key]);
        }

        return sum;
    };
});
//Url filter
core.filter("uri", function($location) {
    return {
        segment: function(segment) {
            var data = $location.absUrl().split("/");
            if (data[segment - 1]) {
                return data[segment - 1];
            }
            return false;
        }
    };
});
core.filter("capitalize", function () {
    return function (input) {
        return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    }
});
core.filter("nltobr", function ($filter) {
    return function (input,length) {
        if (input == null)
            return null;
        var splited = input.split("\n");
        for (var i = 0; i < splited.length; i++) {
            if (splited[i] != null)
                splited[i] = $filter("truncate")(splited[i], length);
        }
        return splited.join("<br/>");
    }
});
core.filter("truncate", function () {
    return function (content, maxCharacters) {

        if (content == null) return "";

        content = "" + content;

        content = content.trim();

        if (content.length <= maxCharacters) return content;

        content = content.substring(0, maxCharacters);

        var lastSpace = content.lastIndexOf(" ");

        if (lastSpace > -1) content = content.substr(0, lastSpace);

        return content + "...";
    };
});

