function AccountRolesController(
    $controller,
    $q,
    $http,
    $rootScope,
    $scope,
    $route,
    $location,
    $window,
    $filter,
    $timeout,
    api,
    appSession,
    appSettings,
    notifyService,
    spinnerService,
    common,
    accountService) {
    
    $controller("InlineEditControllerBase", {
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
        $scope.GridModel.OrderBy = "Name";
        $scope.GridModel.OrderDirection = "Asc";

        $rootScope.$on("AccountLoaded", function () {
            //Call load data as st-pipe will not be called(paging disabled)
            $scope.LoadData();
        });
        $rootScope.$on("AccountSaving", function (event, item) {
            $scope.EditableObject.Roles = $scope.Selection.Rows;
        });
    }
    $scope.ImmediateSave = false;
    $scope.NewRowAddedScrolling = false;

    $scope.GetDataCore = function () {
        
        //var response= {
        //    data:roles,
        //}
        //var deferred = $q.defer();

        //$timeout(function() {
        //    deferred.resolve(response);
        //}, 100);
        return accountService.GetRoles($scope.GridModel);
    }
   
    $scope.DataLoaded = function (result) {
        $scope.DataLoadedCore(result);
        $scope.SyncCheckboxes();
    };
    $scope.SyncCheckboxes = function () {
        $timeout(function () {
            angular.forEach($scope.VisibleRows, function (value, key) {
                if ($scope.IsInRoles(value) === true) {
                    $scope.SelectRow(value);
                } 
            });
        }, 100);
    }
    $scope.IsInRoles = function (role) {
        var roles = $scope.EditableObject.Roles;
        var result = false;
        angular.forEach(roles, function (sub, subkey) {
            if (result == false) {
                if (sub.Id == role.Id) {
                    result = true;
                }
            }
        });

        return result;
    }
    $scope.ValidateRowCore = function (row) {
        var isValid = true;
        var messages = "";
        if (row != null) {
            if (row.Name == null || row.Name == '') {
                messages += "</br>Role name is invalid";
            }
            if (messages.length > 1) {
                notifyService.error("Ups", messages);
                isValid = false;
            }
        }
        return isValid;
    }
    $scope.SaveCore = function (changes) {
        return null;
    }
    $scope.GetTemplate = function (row) {
        if (row == null)
            return "displayrole";
        if (row.Editing)
            return "editrole";
        else return "displayrole";
    }

    $scope.DoInit();
}