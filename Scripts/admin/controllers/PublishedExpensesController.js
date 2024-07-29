function PublishedExpensesController(
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
    itemService) {
    
    $scope.RedrawExpenseTotals = function () {
        if ($scope.VisibleRows!=null) {
            var visible = $filter('filter')($scope.VisibleRows, { IsDeleted: false });
            var total = $filter('total')(visible, "ExpenseAmount");
            if ($scope.EditableObject != null) {
                $scope.TotalExpenses = total;
                $scope.EditableObject.Expenses = $scope.TotalExpenses;
                var val= parseFloat($scope.EditableObject.PurchaseCost + total);
                $scope.EditableObject.PurchaseCostIncExpenses = val.toFixed(2);

            }
        }
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
        $scope.GridModel.OrderBy = "Name";
        $scope.GridModel.OrderDirection = "Asc";
        itemService.GetExpenseTypes($scope.GridModel).then(function (response) {
            var data = common.ResolveData(response);
            if (common.IsValidResponse(data)) {
                $scope.ExpenseTypes = data;
            }
        });
        $scope.$watch("VisibleRows", function (newValue, oldValue) {
            if (oldValue != newValue) {
                $scope.RedrawExpenseTotals();
                $scope.EditableObject.ExpenseList = newValue;
            }
        }, true);
        $rootScope.$on("ItemLoaded", function () {
            $scope.LoadExpenses();
        });
        $rootScope.$on("ItemSaving", function (event, item) {
            var commit = $scope.CommitEdit();
            item.IsValid = commit;
            
        });
        $rootScope.$on("ExpenseTypeChange", function () {
            $scope.LoadExpenseTypes();
        });
        $rootScope.$on("LoadExpenses", function () {
            $scope.LoadExpenses();
        });
    }

    $scope.ImmediateSave = false;
    $scope.NewRowAddedScrolling = false;

    $scope.LoadExpenseTypes = function () {
        itemService.GetExpenseTypes().then(function (resp) {
            var data = common.ResolveData(resp);
            $scope.ExpenseTypes = data;
        });
    }
    $scope.LoadExpenses = function (tableState) {
        var expenses = $scope.EditableObject.ExpenseList;
        if (expenses != null) {
            $scope.VisibleRows = expenses;
        }
        return expenses;
    }
   
    $scope.CreateNewRow = function () {
        var now = $filter('date')(new Date(), 'MM/dd/yyyy');
        var row = {
            Id: 0,
            ExpenseType: '',
            CreatedOn: now,
            ExpenseDate: now,
            ExpenseAmount: 0,
            Quantity: 1,
            LineId: $scope.EditableObject.Id,
            IsNew: true,
            IsDeleted: false,
            Adding: true,
            Editing: true,
        };
        return row;
    }
    $scope.ValidateRowCore = function (row) {
        var isValid = true;
        var messages="";
        if (row != null) {
            if (row.ExpenseAmount == null) {
                messages += "Expense amount is invalid";
            }
            if (row.ExpenseType == null || row.ExpenseType == '') {
                messages += "</br>Expense amount is invalid";
            }
            if (messages.length>1) {
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
            return "displayexp";
        if (row.Editing)
            return "editexp";
        else return "displayexp";
    }

    $scope.DoInit();
}