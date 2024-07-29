function AccountController(
    $controller,
    $rootScope,
    $scope,
    $route,
    notifyService,
    spinnerService,
    itemService,
    appSession,
    appSettings,
    $window,
    $location,
    $filter,
    $q,
    $timeout,
    common,
    companyService,
    accountService,
    sessionContext) {

    $scope.OriginalObject = {};
    $scope.EditableObject = {
        IsNew: true,
    };

    $controller("ControllerBase", {
        $controller: $controller,
        $rootScope: $rootScope,
        $scope: $scope,
        $route: $route,
        $q: $q,
        $location: $location,
        $timeout: $timeout,
        $filter: $filter,
        appSession: appSession,
        notifyService: notifyService,
        spinnerService: spinnerService,
        common: common,
        appSettings: appSettings,
    });

  
    $scope.Init = function () {
        $scope.InitCore();
    };
    
    $scope.OnSaving = function (item) {
        return $rootScope.$broadcast("AccountSaving", item);
    }
    $scope.SaveData = function() {
        $scope.OnSaving($scope.EditableObject);
        if ($scope.EditableObject.IsValid == false)
            return false;
        common.StartLoading($scope, true);
        accountService.Update($scope.EditableObject)
            .then(function(response) {
                var data = common.ResolveData(response);
                if (common.IsValidResponse(data) && data.Success) {
                    common.CopyTo(data.Entity, $scope.EditableObject, false);
                    common.CopyTo(data.Entity, $scope.OriginalObject, false);
                    $scope.EditableObject.IsNew = false;
                    common.StopLoadingResponse(response, true, $scope, false);
                }
            }, function(response) {
                common.StopLoadingResponse(response, true, $scope, true);
            });
    };
    
    $scope.LoadData = function () {
        var id = common.GetQueryStringValue("id");
        var promise;
        if (id != null && id != '') {
            promise = accountService.GetUser(id);
            
        } else {
            promise = accountService.GetCurrentUser();
        }
        
        common.StartLoading($scope, true);
        promise.then(function (response) {
            var data = common.ResolveData(response);
            if (common.IsValidResponse(data) && data.Success == true) {
                common.CopyTo(data.Entity, $scope.EditableObject, false);
                common.CopyTo(data.Entity, $scope.OriginalObject, false);
                $rootScope.$broadcast("AccountLoaded");
                $scope.EditableObject.IsNew = false;
                $scope.EditableObject.IsOwner = sessionContext.Current.UserId == $scope.EditableObject.Id;
                $scope.EditableObject.IsAdmin = sessionContext.Current.IsAdmin;
                common.StopLoadingResponse(response, true, $scope, false);
                
            } else {
                common.StopLoadingResponse(response, false, $scope, true);
            }

        }, function (response) {
            common.StopLoadingResponse(response, true, $scope, true);
        });
    }
    $scope.LoadData();
}