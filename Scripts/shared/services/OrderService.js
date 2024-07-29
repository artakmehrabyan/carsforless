function OrderService(api, appSettings) {
    var self = {};
    //Cart
    self.AddToCart = function (model) {
        return api.post(appSettings.Api_Order_AddToCart, model);
    }
    self.SaveCart = function (cart) {
        return api.post(appSettings.Api_Order_SaveCart, cart);
    }
    self.GetShoppingCart = function (model) {
        return api.get(appSettings.Api_Order_GetShoppingCartUrl, model);
    }
  
    return self;
}