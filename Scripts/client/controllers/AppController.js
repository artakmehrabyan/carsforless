function AppController(
    $controller,
    $rootScope,
    $scope,
    $q,
    $window,
    $location,
    $http,
    $timeout,
    authService,
    notifyService,
    spinnerService,
    common,
    api,
    appSettings,
    req,
    cart) {

    $scope.Options =
    {
        Notification: {
            Message: "",
            Show: false,
            Type: "info",
            ShowAsPopup:false,
        }
    };

    $scope.SearchText = "";
    var search = common.GetQueryStringValue("search");
    if (search != null) {
        $scope.SearchText = search;
    }
   
   
    $scope.InitCart = function () {
        $scope.CartCount = cart.GetItems().length;
        $scope.CartTotal = cart.TotalCost();
        $scope.InitializingCart = false;
        $rootScope.$on("Cart:change", function () {
            $scope.CartCount =cart.GetItems().length;
            $scope.CartTotal =cart.TotalCost();
            $scope.InitializingCart = true;
            $timeout(function () {
                if ($scope.CartCount > 0) {
                    $scope.InitializingCart = false;
                }
            }, 2000);
        });
    }
    $scope.AddToCart = function (item) {
        var inCart = $scope.IsInCart(item);
        item.IsInCart = inCart;
        if (inCart) {
            $scope.ShowAnimatedNotification("Item is already in your wish list", "error");
            return;
        }
        cart.AddItem(item.Id, 1, item.RetailCost, function () {
            return {
                Url: item.ImageUrl,
                Description: item.Description
            }
        });
        $scope.ShowAnimatedNotification("Item has been added to wish list");

    }
    $scope.ShowAnimatedNotification = function (message, type) {
        if (type == null)
            type = "info";
        $scope.Options.Notification.Message = message;
        $scope.Options.Notification.Show = true;
        $scope.Options.Notification.Type = type;
        $timeout(function () {
            $scope.Options.Notification.Show = false;
        }, 2000);
        
        if ($scope.Options.Notification.ShowAsPopup==true) {
          
            if ($scope.Options.Notification.Type == "error") {
                notifyService.error($scope.Options.Notification.Message);
            }
            if ($scope.Options.Notification.Type == "info") {
                notifyService.info($scope.Options.Notification.Message);
            }
        }
    }
    $scope.IsInCart = function (item) {
        var isIn = cart.IsInCart(item);
        return isIn;
    }
    $scope.Search = function () {
        var url = $window.location.href;

        if (url.indexOf(appSettings.ItemsViewUrl) >= 0) {
            $window.location.replace(appSettings.Client_Item_List_Url + "?search=" + $scope.SearchText);
        } else
            $window.open(appSettings.Client_Item_List_Url + "?search=" + $scope.SearchText, "_blank");
    }

    $scope.Init = function () {
        $rootScope.$on("Cart:init", function (c) {
            $scope.InitCart();
        });
        //$scope.InitCart();
    }
    $scope.GoToItemDetailsPage = function (id, newWindow) {
        var url = "/car/details?id=" + id;
        if (newWindow == null || newWindow == false)
            common.GoTo(url);
        else
            common.OpenWindow(url);
    }
    
    $scope.Init();
};
