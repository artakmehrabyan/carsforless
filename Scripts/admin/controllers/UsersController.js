function UsersController(
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
    accountService) {

    $scope.Reset = function (forceLoad) {
        $scope.GridModel.OrderBy = "CreatedOn";
        $scope.GridModel.OrderDirection = "Desc";
        $scope.GridModel.Skip = 0;
        $scope.GridModel.Take = 100;
    }
    
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
        $scope.Reset();
    }
    $scope.CreateNewRow = function () {
	    var row = {
		    Id: 0,
		    UserName: '',
		    IsNew: true,
		    Adding: true,
		    Editing: true,
	    };
	    return row;
    }
    $scope.CanDeleteRow=function(row) {
        if (row != null && row.IsSystemAccount == false) {
            return true;
        }
        return false;
    }
    $scope.GetDataCore = function (model, tableState) {
        return accountService.GetUsersPaged(model);
    }
    $scope.DataLoaded = function (result) {
        $scope.DataLoadedCore(result);
        //if ($scope.GridModel.Search != null || $scope.GridModel.From != null || $scope.GridModel.To != null) {
        //    $scope.SaveState("published");
        //}
    }
    $scope.ValidateRowCore = function (row) {
	    var isValid = true;
	    if ($scope.usersForm.$invalid)
		    return false;
	    if (row != null) {
            if (row.UserName == null || row.UserName == "") {
			    isValid = false;
		    }
            if (row.Email == null || row.Email == null) {
			    isValid = false;
            }
            if (row.IsNew) {
	            if (row.Password == null || row.Password == "") {
		            isValid = false;
	            }
	            if (row.ConfirmPassword == null || row.ConfirmPassword == "") {
		            isValid = false;
	            }
	            if (row.Password != row.ConfirmPassword) {
		            isValid = false;
	            }
            }
	    }
	    return isValid;
    }
    var saving = false;
    $scope.SaveCore = function (changes) {
	    if (saving)
		    return false;
	    saving = true;
        var deferred = $q.defer();
        if (changes == null || changes.length < 1) {
	        return false;
        }
        var row = changes[0];
        var res;
        if (row.IsNew) {
	        res = accountService.Create(changes[0]);

        } else if(row.IsDeleted){
            res = accountService.Delete(changes[0]);
        }
        else {
	        res = accountService.Update(changes[0]);
        }
        res
            .then(function (response) {
	            saving = false;
			    var data = common.ResolveData(response);
			    if (data.Success == true) {
				    $scope.Broadcast();
			    }
			    deferred.resolve(response);
		    });
	    return deferred.promise;
    }
    $scope.Broadcast = function () {
	    if (window.$windowScope != null) {
		    window.$windowScope.$root.$broadcast("UsersChange", null);
	    }
    }

    $scope.DoInit();
}