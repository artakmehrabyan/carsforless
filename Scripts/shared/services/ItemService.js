function ItemService(api, appSettings,common) {
    var self = this;
    var odometerDefs = [

    ];
    odometerDefs.push({
        Id: 0,
        Name: "Unknown"
    });
    odometerDefs.push({
        Id: 1,
        Name: "Actual"
    });
    odometerDefs.push({
        Id: 2,
        Name: "Not Actual"
    });

    self.GetColors = function () {
        var colors = [
            "CREAM",
            "CHAMPAGNE",
            'PURPLE',
            'Silver',
            'Green',
            'GRAY',
            'CHARCOAL',
            'OLIVE',
            'GREY',
            'SAND',
            'Red',
            'BROWN',
            'Maroon',
            'GOLD',
            'BEIGE',
            'BURGUNDY',
            'Black',
            'Blue',
            'PEWTER',
            'Teal',
            'Yellow',
            'White',
            'TAN',
            'ORANGE'
        ];
        return colors.sort();
    }
    self.ImportItem = function (vin) {
        var result = api.get(appSettings.Api_Item_ImportItemUrl + "?vin=" + vin);
        return result;
    }
    self.GetItem = function (id) {
        var result = api.get(appSettings.Api_Item_GetItemUrl, { id: id });
        return result;
    }
    self.GetItemsOfBestOffer = function () {
        var result = api.get(appSettings.Api_Item_GetItemsOfBestOfferUrl);
        return result;
    }
    self.GetItemsLatestOffer = function () {
        var result = api.get(appSettings.Api_Item_GetItemsLatestOfferUrl);
        return result;
    }
    self.GetItemsForHomePage = function () {
        var result = api.get(appSettings.Api_Item_GetItemsForHomePageUrl);
        return result;
    }
    self.GetList = function (model) {
        var result = api.get(appSettings.Api_Item_GetList, model);
        return result;
    }
    self.FindItems = function (model) {
        var result = api.get(appSettings.Api_Item_FindItems, model);
        return result;
    }
    self.GetStatisticData = function (model) {
        var result = api.post(appSettings.Api_Item_GetStatisticsUrl, model);
        return result;
    }
    self.GetManufacturers = function (request) {
        var result = api.get(appSettings.Api_Manufacturer_GetListUrl, request);
        return result;
    }
    self.SaveManufacturers = function (request) {
        var result = api.post(appSettings.Api_Manufacturer_SaveUrl, request);
        return result;
    }
    self.DeleteItem = function (item) {
        var result = api.post(appSettings.Api_Item_DeleteItemUrl, item);
        return result;
    }
    self.GetModels = function (request) {
        var result = api.get(appSettings.Api_Item_GetModelsUrl, request);
        return result;
    }
    self.SaveModels = function (request) {
        var result = api.post(appSettings.Api_Item_SaveModelsUrl, request);
        return result;
    }
    self.GetTitleStatuses = function (request) {
        var result = api.get(appSettings.Api_Item_GetTitleStatusesUrl, request);
        return result;
    }
    self.SaveTitleStatuses = function (request) {
        var result = api.post(appSettings.Api_Item_SaveTitleStatusesUrl, request);
        return result;
    }

    self.GetExpenseTypes = function (request) {
        var result = api.get(appSettings.Api_Item_GetExpenseTypesUrl, request);
        return result;
    }
    self.SaveExpenseTypes = function (request) {
        var result = api.post(appSettings.Api_Item_SaveExpenseTypesUrl, request);
        return result;
    }
    self.GetTitleBrands = function (request) {
        var result = api.get(appSettings.Api_Item_GetTitleBrandsUrl, request);
        return result;
    }
    self.SaveTitleBrands = function (request) {
        var result = api.post(appSettings.Api_Item_SaveTitleBrandsUrl, request);
        return result;
    }
    self.GetWarranties = function (request) {
        var result = api.get(appSettings.Api_Item_GetWarrantiesUrl, request);
        return result;
    }
    self.SaveWarranties = function (request) {
        var result = api.post(appSettings.Api_Item_SaveWarrantiesUrl, request);
        return result;
    }

    self.GetInventoryPartSales = function (request) {
        var result = api.get(appSettings.Api_Item_GetInventoryPartSalesUrl, request);
	    return result;
    }
    self.GetTitleStatusDue = function (request) {
        var result = api.get(appSettings.Api_Item_GetTitleStatusDueUrl, request);
	    return result;
    }
    self.SaveInventoryPartSales = function (request) {
        var result = api.post(appSettings.Api_Item_SaveInventoryPartSalesUrl, request);
	    return result;
    }
    self.SaveTitleStatusDue = function (request) {
        var result = api.post(appSettings.Api_Item_SaveTitleStatusDueUrl, request);
	    return result;
    }

    self.GetCarOptions = function (request) {
        var result = api.get(appSettings.Api_Item_GetCarOptionsUrl, request);
        return result;
    }
    self.SaveCarOptions = function (request) {
        var result = api.post(appSettings.Api_Item_SaveCarOptionsUrl, request);
        return result;
    }
    self.GetTypes = function () {
        var types = [
            "Coupe",
            "Hatchback",
            "Sedan",
            "Truck",
            "SUV",
            "Van",
            "Wagon",
            "Sports Car",
            "Convertible",
            "Hybrid Car",
            "Luxury Car",
            "Crew Pickup",
            "Crossover",
            "Electric Cars"];
        return types;
    }
    self.SetFlags = function (model, flags) {
        var result = api.post(appSettings.Api_Item_SetFlagsUrl, { Item: model, Flags: flags }, null);
        return result;
    }
    self.SetAsMainImage = function (itemId, picUrl) {
        var result = api.post(appSettings.Api_Item_SetAsMainImageUrl, { itemId: itemId, picUrl: picUrl }, null);
        return result;
    }
    self.SetSellReady = function (item, ready) {
        var req = {
            Item: item,
            IsSellReady: ready
        }
        var result = api.post(appSettings.Api_Item_SetSellReadyUrl, req);
        return result;
    }
    self.GetPaymentTypes = function () {
        var types = [
            "Deposit",
            "Full Payment",
            "Finance"
        ];
        return types;
    }
    self.GetPaymentTypeObjects = function () {
        var result = api.get(appSettings.Api_Item_GetPaymentTypesUrl);
        return result;
    }
    self.GetPaymentMethods = function () {
        var result = api.get(appSettings.Api_Item_GetPaymentMethodsUrl);
        return result;
    }
    self.GetAds = function () {
        var result = api.get(appSettings.Api_Item_GetAdsUrl);
        return result;
    }
    self.GetPlateTruckings = function (request) {
        var result = api.get(appSettings.Api_Item_GetPlateTruckingsUrl, request);
        return result;
    }
    self.GetPlateTruckingNos = function (request) {
        var result = api.get(appSettings.Api_Item_GetPlateTruckingNosUrl, request);
        return result;
    }
    self.SavePlateTruckings = function (request) {
        var result = api.post(appSettings.Api_Item_SavePlateTruckingsUrl, request);
        return result;
    }

    self.GetPlateTruckingStats = function (model) {
        var result = api.post(appSettings.Api_Item_GetPlateTruckingStatsUrl, model);
        return result;
    }
    //Media
    self.UpdateMedia = function (model) {
        var result = api.post(appSettings.Api_Item_UpdateMediaUrl, model);
        return result;
    }
    self.UpdateMediaOrders = function (medias) {
        var result = api.post(appSettings.Api_Item_UpdateMediaOrdersUrl, medias);
        return result;
    }
    self.OpenItemTitleTracking = function (itemId) {
        common.OpenWindow(appSettings.Admin_Item_ItemTitleStatusTrackingUrl + "?itemId=" + itemId);
    }
    self.GetTitleStatusTrackings = function (model) {
        var result = api.get(appSettings.Api_Item_GetTitleStatusTrackingsUrl, model);
        return result;
    }
    self.SaveTitleStatusTrackings = function (model) {
        var result = api.post(appSettings.Api_Item_SaveTitleStatusTrackingsUrl, model);
        return result;
    }

    self.AddToCart = function (model) {
        return api.post(appSettings.Api_Item_AddToCart, model);
    }
    self.SaveCart = function (cart) {
        return api.post(appSettings.Api_Item_SaveCart, cart);
    }
    self.GetShoppingCart = function (model) {
        return api.get(appSettings.Api_Item_GetShoppingCartUrl, model);
    }
    self.GetOdometerDef=function(id) {
        var it = odometerDefs.filter(function (item) {
            return item.Id ===id;
        })[0];
        
        if (it != null) {
            return it.Name;
        }
        return 'Unknown';
    }

    self.GetInventoryPartSaleStats = function (model) {
        var result = api.post(appSettings.Api_Item_GetInventoryPartSaleStatsUrl, model);
	    return result;
    }
    return self;
}