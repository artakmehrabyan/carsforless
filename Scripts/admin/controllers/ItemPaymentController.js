function ItemPaymentController(
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

    $scope.RecalcTotals= function () {
        if ($scope.VisibleRows != null) {
            var visible = $filter('filter')($scope.VisibleRows, { IsDeleted: false });
            var total = $filter('total')(visible, "PaymentAmount");
            if ($scope.EditableObject != null) {
                var totalDue = $scope.EditableObject.SoldCost - total;
                $scope.EditableObject.TotalDue = totalDue;
                $scope.EditableObject.TotalPaidAmount = total;
                if ($scope.OriginalObject.TotalPaidAmountBoS == null || $scope.OriginalObject.TotalPaidAmountBoS == 0) {
                    $scope.EditableObject.TotalPaidAmountBoS = total;
                }
            }
        }
        var totalDueBoS = $scope.EditableObject.BillPrice - $scope.EditableObject.TotalPaidAmountBoS;
        $scope.EditableObject.TotalDueBoS = totalDueBoS;
    }
   
    $scope.OnTotalPaidAmountBoSLostFocus=function() {
        $scope.RecalcTotals();
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
        if ($scope.InitCore != null)
            $scope.InitCore();
        $scope.GridModel.OrderBy = "Name";
        $scope.GridModel.OrderDirection = "Asc";
        $scope.$watch("VisibleRows", function (newValue, oldValue) {
            if (oldValue != newValue) {
                $scope.RecalcTotals();
                $scope.EditableObject.Payments = newValue;
            }
        }, true);
        $rootScope.$on("ItemLoaded", function () {
            $scope.LoadPayments();
        });
        $rootScope.$on("ItemSaved", function () {
            $scope.LoadPayments();
        });
        $rootScope.$on("ItemSaving", function (event, item) {
            var commit = $scope.CommitEdit();
            item.IsValid = commit;
        });
        $scope.$watch("EditableObject.SoldCost", function (newValue, oldValue) {
            $scope.RecalcTotals();
        });
        $scope.$watch("EditableObject.BillPrice", function (newValue, oldValue) {
            if (newValue != null) {
                $scope.RecalcTotals();
            }
        });
    }
    $scope.ImmediateSave = false;
    $scope.NewRowAddedScrolling = false;

   
    $scope.LoadPayments = function (tableState) {
  

        var payments = $scope.EditableObject.Payments;
        if (payments != null) {
            $scope.VisibleRows = payments;
        }
        return payments;
    }
   
    $scope.CreateNewRow = function () {
        var now = $filter("date")(new Date(), "MM/dd/yyyy");
        var row = {
            Id: 0,
            PaymentTypeId:2,
            PaymentMethodId:0,
            CreatedOn: now,
            PaymentDate: now,
            PaymentAmount: 0,
            Quantity: 1,
            ItemId: $scope.EditableObject.Id,
            IsNew: true,
            IsDeleted: false,
            Adding: true,
            Editing: true,
        };
        return row;
    }
    $scope.ValidateRowCore = function (row) {
        var isValid = true;
        var messages = "";
        if (row != null) {
            if (row.PaymentAmount == null || row.PaymentAmount < 1) {
                messages += "Payment amount is invalid";
            }
            if (row.PaymentTypeId == null) {
                messages += "</br>Payment type is invalid";
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
    $scope.GetTemplate = function(row) {
        if (row == null)
            return "displaypayment";
        if (row.Editing)
            return "editpayment";
        else return "displaypayment";
    };
    $scope.DoInit();
}