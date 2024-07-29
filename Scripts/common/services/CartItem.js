function CartItem($rootScope, $log) {
    var item = function (id, quantity,price,data) {
        this.SetId(id);
        this.SetQuantity(quantity);
        this.SetPrice(price);
        this.SetData(data);
    };

    item.prototype.SetId = function (id) {
        if (id)
            this._id = id;
        else {
            $log.error("An ID must be provided");
        }
    };
    item.prototype.GetId = function () {
        return this._id;
    };

    item.prototype.SetPrice = function (price) {
        var priceFloat = parseFloat(price);
        if (priceFloat) {
            if (priceFloat <= 0) {
                $log.error("A price must be over 0");
            } else {
                this._price = (priceFloat);
            }
        } else {
            $log.error("A price must be provided");
        }
    };
    item.prototype.GetPrice = function () {
        return this._price;
    };


    item.prototype.SetQuantity = function (quantity, relative) {
        
        var quantityInt = parseInt(quantity);
        if (quantityInt % 1 === 0) {
            if (relative === true) {
                this._quantity += quantityInt;
            } else {
                this._quantity = quantityInt;
            }
            if (this._quantity < 1)
                this._quantity = 1;

        } else {
            this._quantity = 1;
            $log.info('Quantity must be an integer and was defaulted to 1');
        }
    };
    item.prototype.GetQuantity = function () {
        return this._quantity;
    };

    item.prototype.SetData = function (data) {
        if (data) this._data = data;
    };
    item.prototype.GetData = function () {
        if (this._data) return this._data;
        else $log.info('This item has no data');
    };

    item.prototype.GetTotal = function () {
        return +parseFloat(this.GetQuantity() * this.GetPrice()).toFixed(2);
       // return +parseFloat(this.GetPrice()).toFixed(2);
    };

    item.prototype.ToObject = function () {
        return {
            ItemId: this.GetId(),
            Price: this.GetPrice() * this.GetQuantity(),
            Quantity: this.GetQuantity(),
            Data: this.GetData(),
        }
    };
    return item;
}