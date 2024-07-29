var app = angular.module("app", ["core"]);

/* Core Module Config
-----------------------------------------------------------------------------------------------------------------*/


//Controllers
app.controller("AppController", AppController);
app.controller("AccountController", AccountController);
app.controller('ContactController', ContactController);
app.controller('HomeController', HomeController);
app.controller('CarDetailController', CarDetailController);
app.controller('CarListController', CarListController);
app.controller('carFilterController', carFilterController);
app.controller('ShoppingCartController', ShoppingCartController);

app.config(['$compileProvider', function ($compileProvider) {
    $compileProvider.debugInfoEnabled(false);
}]);

app.run(function ($rootScope, cart, store, common) {
    $rootScope.$on("Cart:change", function () {
        cart.Save();
    });
    var cartToken = store.Get("Cart_Token");
    
    if (cartToken == null) {
        
        cartToken = common.NewToken();
        store.Set("Cart_Token", cartToken);
    }
    cart.RestoreFromToken(cartToken);
});
/*app.controller("ServicesController", ServicesController);
app.controller("MyOrdersControllerBase", MyOrdersControllerBase);*/

/*app.config(function ($routeProvider, $locationProvider) {
    var topMenu = [];
    topMenu.push({
        Segment: "/",
        Name: "Home",
        Controller: "IndexController",
        TemplateUrl: "/Home/Home",
    });
    topMenu.push({
        Segment: "/about",
        Name: "About",
        Controller: "AboutController",
        TemplateUrl: "/Home/About",
    });
    topMenu.push({
        Segment: "/order/services",
        Name: "About",
        Controller: "OrderServicesController",
        TemplateUrl: "/Order/Services",
    });

    angular.forEach(topMenu, function (item) {
        $routeProvider
            .when(item.Segment, {
                templateUrl: item.TemplateUrl,
                controller: item.Controller
            });

    });
    $routeProvider.otherwise({
        redirectTo: "/home/index"
    });
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
});*/




