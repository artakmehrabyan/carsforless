function BillOfSaleController(
    $controller,
    $scope,
    notifyService,
    spinnerService,
    itemService,
    common,
    appSession) {

    $scope.Item = {};

    $scope.LoadData = function () {
        var id = common.GetQueryStringValue("id");
        if (id != null && id != '') {
            itemService.GetItem(id).then(function (response) {
                var data = common.ResolveData(response);
                if (common.IsValidResponse(response) && data.Success == true) {
                    common.CopyTo(data.Entity, $scope.Item, false);
                } 
            });
        }
    }
    $scope.LoadData();


}