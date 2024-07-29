function HomeController($controller, $scope, itemService, appSettings, spinnerService, common, $timeout, cart) {

    $scope.Init = function () {
        itemService.GetItemsForHomePage().then(function (response) {
            var resp = common.ResolveData(response);
            $scope.HomeItems = resp.Set;

            $timeout(function () {
                App.Index.InitLatestOffer();
                App.Index.InitBestOffer();
            }, 100);
        });
    }
  
   
    $scope.Init();
}