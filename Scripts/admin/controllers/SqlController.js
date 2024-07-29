function SqlController(
    $controller,
    $rootScope,
    $scope,
    $route,
    $q,
    $location,
    $timeout,
    $filter,
    notifyService,
    spinnerService,
    itemService,
    appSession,
    appSettings,
    req,
    $window,
    common,
    manage) {

    $scope.Sql = "SELECT top 10.* FROM Item";

    $scope.cmOption = {
        lineNumbers: true,
        indentWithTabs: true,
        mode: "text/x-sql",

    };

    $scope.Reset = function (forceLoad) {
        $scope.GridModel.OrderBy = "CreatedOn";
        $scope.GridModel.OrderDirection = "Desc";
        $scope.GridModel.Skip = 0;
        $scope.GridModel.Take = 100000;
        $scope.GridModel.VirtualLoad = true;
        $scope.GridModel.VirtualLoadPageSize = 100;
    }

    $controller("GridControllerBase", {
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
        $scope.Reset();
    }

    $scope.CanDeleteRow = function (row) {
        return false;
    }
    $scope.GetDataCore = function (model, tableState) {
        return manage.RunSql($scope.Sql);
    }
    $scope.DataLoaded = function (result) {
        $scope.DataLoadedCore(result);
        $scope.Columns = result.Columns;
        console.log()
        
        //if ($scope.GridModel.Search != null || $scope.GridModel.From != null || $scope.GridModel.To != null) {
        //    $scope.SaveState("published");
        //}
    }
   $scope.GetTemplate =function(row) {
       return 'display';
   }
   $scope.RunSql=function() {
       if ($scope.Sql.toLowerCase().indexOf("delete") != -1) {
           notifyService.error("SQL Error", "Delete not allowed");
       }
       if ($scope.Sql.toLowerCase().indexOf("update") != -1) {
           notifyService.error("SQL Error", "Update not allowed");
       }
       else {
           $scope.Refresh();
       }
   }
   $scope.DataError = function (response) {
       $scope.OnDataError(response);
   }; 
  
  $scope.OpenFile= function() {
        common.OpenFile(".sql",
            function(content) {
                $scope.Sql = content;
            });
    }
    $scope.DoInit();
}