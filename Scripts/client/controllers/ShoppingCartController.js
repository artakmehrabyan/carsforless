function ShoppingCartController(
    $q,
    $http,
    $rootScope,
    $scope,
    $timeout,
    $window,
    authService,
    appSession,
    appSettings,
    resources,
    notifyService,
    spinnerService,
    common,
    sessionContext,
    ord,
    cart) {

    
    $scope.LoadData = function () {
        spinnerService.show();
        $rootScope.$on("Cart:init", function (c) {
            $scope.LoadCart();
        });
    }
    $scope.LoadCart = function () {
        $scope.VisibleItems = [];
        $scope.Items = [];
        var items = cart.GetCart().items;
        angular.forEach(items, function (it) {
            $scope.Items.push(it);
        });
        $scope.VisibleItems = $scope.Items;
        spinnerService.hide();
    }
    $scope.Remove = function (item) {
        for (var i = $scope.VisibleItems.length; i--;) {
            if ($scope.VisibleItems[i].GetId() === item._id) {
                $scope.VisibleItems.splice(i, 1);
                return;
            }
        }
    }
  
    $scope.DeleteItem = function (item) {
        common.Confirm("Remove this item from the cart?", function () {
            cart.RemoveItemById(item.GetId());
            $scope.Remove(item);
        });
    }
    $scope.Checkout = function () {
        notifyService.info("Comming soon!", "This functionality will be coming soon");
    }
    $scope.GoBack=function() {
        common.GoBack();
    }
    $scope.Clear = function () {
        common.Confirm("Clear cart items?", function () {
            cart.Empty();
            $scope.LoadCart();
        });
    }
    $scope.LoadData();
}


