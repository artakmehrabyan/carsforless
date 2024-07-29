function Cart($rootScope, ngCartItem, store, itemService, common) {
    this.Init = function () {
        this.$cart = {
            shipping: null,
            taxRate: null,
            tax: null,
            token:null,
            items: []
        };
    };

    this._exp = { days: 14 };
    this.GetCart = function () {
        return this.$cart;
    };
    this.SetCart = function (cart) {
        this.$cart = cart;
        return this.GetCart();
    };
    this.GetItems = function () {
        return this.GetCart().items;
    };

    this.AddItem = function (id, quantity,price,dataGetter) {
        var inCart = this.GetItemById(id);
        var data = null;
        if (typeof inCart === "object") {
            //Update quantity of an item if it's already in the cart
            inCart.SetQuantity(quantity, true);
            if (dataGetter != null) {
                data = dataGetter(inCart);
                inCart.SetData(data);
            }
            $rootScope.$broadcast("Cart:itemUpdated", inCart);
        } else {
            if (dataGetter != null) {
                data = dataGetter(inCart);
            }
            inCart = new ngCartItem(id, quantity,price,data);
            this.$cart.items.push(inCart);
            $rootScope.$broadcast("Cart:itemAdded", inCart);
        }
        $rootScope.$broadcast("Cart:change", {});
        return inCart;
    };
    this.IsInCart = function (searchItem) {
        var items = this.GetItems();
        var result = false;
        angular.forEach(items, function (item) {
            if (item.GetId() == searchItem.Id)
                result = true;
        });
        return result;
    }
    this.GetItemById = function (itemId) {
        var items = this.GetCart().items;
        var build = false;

        angular.forEach(items, function (item) {
            if (item.GetId() === itemId) {
                build = item;
            }
        });
        return build;
    };
    this.SetShipping = function (shipping) {
        this.$cart.shipping = shipping;
        return this.GetShipping();
    };
    this.GetShipping = function () {
        if (this.GetCart().items.length == 0)
            return 0;
        return this.GetCart().shipping;
    };
    this.SetTaxRate = function (taxRate) {
        this.$cart.taxRate = +parseFloat(taxRate).toFixed(2);
        return this.GetTaxRate();
    };
    this.GetTaxRate = function () {
        return this.$cart.taxRate;
    };
    this.GetTax = function () {
        return +parseFloat(((this.GetSubTotal() / 100) * this.GetCart().taxRate)).toFixed(2);
    };
    this.GetToken = function () {
        return this.$cart.token;
    };
    this.GetTotalItems = function () {
        var count = 0;
        var items = this.GetItems();
        angular.forEach(items, function (item) {
            count += item.GetQuantity();
        });
        return count;
    };
    this.GetTotalUniqueItems = function () {
        return this.GetCart().items.length;
    };
    this.GetSubTotal = function () {
        var total = 0;
        angular.forEach(this.GetCart().items, function (item) {
            total += item.GetTotal();
        });
        return +parseFloat(total).toFixed(2);
    };
    this.TotalCost = function () {
        return +parseFloat(this.GetSubTotal() + this.GetShipping() + this.GetTax()).toFixed(2);
    };
    this.RemoveItem = function (index) {
        var item = this.$cart.items.splice(index, 1)[0] || {};
        $rootScope.$broadcast("Cart:itemRemoved", item);
        $rootScope.$broadcast("Cart:change", {});

    };
    this.RemoveItemById = function (id) {
        var item;
        var cart = this.GetCart();
        angular.forEach(cart.items, function (item, index) {
            if (item.GetId() === id) {
                item = cart.items.splice(index, 1)[0] || {};
                $rootScope.$broadcast("Cart:itemRemoved", item);
                $rootScope.$broadcast("Cart:change", {});
            }
        });
        this.SetCart(cart);
       
    };

    this.Empty = function () {
        this.$cart.items = [];
        $rootScope.$broadcast("Cart:change", {});
    };

    this.IsEmpty = function () {
        return (this.$cart.items.length > 0 ? false : true);
    };
    this.ToObject = function () {
        if (this.GetItems().length === 0)
            return false;

        var items = [];
        angular.forEach(this.GetItems(), function (item) {
            items.push(item.ToObject());
        });
        
        var it= {
            shipping: this.GetShipping(),
            tax: this.GetTax(),
            token: this.GetToken(),
            taxRate: this.GetTaxRate(),
            subTotal: this.GetSubTotal(),
            TotalCost: this.TotalCost(),
            items: items
        }
        return it;
    };
    this.Restore = function (storedCart) {
        var self = this;
        self.Init();
        self.$cart.shipping = storedCart.shipping;
        self.$cart.tax = storedCart.tax;
        self.$cart.token = storedCart.token;
        if (storedCart.items != null) {
            if (storedCart.items.length > 0) {
                angular.forEach(storedCart.items, function(item) {
                    self.$cart.items.push(new ngCartItem(
                        item.ItemId,
                        1,
                        item.Price,
                        item));
                });
            }
        }
        //this.Save();
    };
    this.RestoreFromToken = function (token) {
        //var thisCart = this;
        //var crt = store.Get(token);
        ////var crt = angular.fromJson(res);
        //if (angular.isObject(crt)) {
        //    thisCart.Restore(crt);
        //} else {
        //    thisCart.Init();
        //    thisCart.$cart.token = token;
        //}
        //$rootScope.$broadcast("Cart:init", crt);


        var model = {
            Token: token,
            CartStatus: 0,
            OrderBy: "CreatedOn",
            OrderDirection: "Desc",
        };
        var thisCart = this;
        var promise = itemService.GetShoppingCart(model).then(function (response) {
            var res = common.ResolveData(response);
            var crt = res;
            crt.token = token;
            //var crt1 = store.GetJson(token);
            // var crt = angular.fromJson(res);
            if (angular.isObject(crt)) {
                thisCart.Restore(crt);
            } else {
                thisCart.Init();
                thisCart.$cart.token = token;
            }
            $rootScope.$broadcast("Cart:init", crt);
        });
        return promise;
    }
    this.Save = function () {
        //var cart = this.GetCart();
        //if (cart == null)
        //    return;
        ////var saveable = JSON.stringify(cart);
        ////return store.SetJson(cart.token, saveable);
        //store.Set(this.GetToken(), cart,this._exp);

        //SAVE TO DATABASE
        var cart = this.GetCart();
        if (cart == null)
            return;
        var items = this.ToObject().items;
        if (items == null)
            items = [];
        var model = {
            Token: cart.token,
            Cart: items
        };
        //var saveable = JSON.stringify(cart);
        //return store.SetJson(cart.token, saveable);
        itemService.SaveCart(model).then(function () { });
    }
}