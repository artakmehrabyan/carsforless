function InlineEditControllerBase(
    $controller,
    $rootScope,
    $scope,
    $route,
    $q,
    $location,
    $timeout,
    $filter,
    appSession,
    authService,
    notifyService,
    spinnerService,
    common,
    appSettings) {

    $scope.NewRowPosition = "bottom";
    $scope.NewRowAddedScrolling = true;

    var parent = $controller("GridControllerBase", {
        $controller: $controller,
        $rootScope: $rootScope,
        $scope: $scope,
        $route: $route,
        $q: $q,
        $location: $location,
        $timeout: $timeout,
        $filter: $filter,
        appSession: appSession,
        authService: authService,
        notifyService: notifyService,
        spinnerService: spinnerService,
        common: common,
        appSettings: appSettings,
    });
    $scope.EditingRowOriginal = null;
    $scope.EditingRow = null;
    $scope.EditingRowIndex = -1;
    $scope.ImmediateSave = true;
    var hasChanges = false;
    $scope.RefreshOnSave = true;
    $scope.Init = function () {
        if ($scope.InitCore != null)
            $scope.InitCore();
    }

    $scope.CanAddRow = function (row) {
        //return $scope.EditingRow == null;
        return true;
    }
    $scope.CanUpdateRow = function (row) {
        var res = $scope.EditingRow == null;
        return res;
    }
    $scope.CanDeleteRow = function (row) {
        return $scope.EditingRow == null;
    }

    $scope.AddNew = function () {
        if ($scope.EditingRow != null) {
            if ($scope.CommitEdit() == false)
                return false;
        }
        var newRow = $scope.CreateNewRow();
        if ($scope.CanAddRow(newRow) == false)
            return false;
        if ($scope.NewRowPosition == "bottom") {
            $scope.VisibleRows.push(newRow);
        } else if ($scope.NewRowPosition == "top") {
            $scope.VisibleRows.splice(0, 0, newRow);
        }
        $scope.BeginEditRow(newRow);
        newRow.IsNew = true;
        if ($scope.NewRowAddedScrolling && $scope.VisibleRows.length > 25) {
            common.ScrollToBottom();
        }

    }
    $scope.BeginEditRow = function (row) {
        if ($scope.CanUpdateRow(row) == false)
            return;
        $scope.EditingRow = row;
        $scope.EditingRowIndex = $scope.VisibleRows.indexOf(row);
        $scope.EditingRowOriginal = angular.copy($scope.EditingRow);
        row.Editing = true;
        row.IsNew = false;
    }
    $scope.GetChanges = function () {
        var changes = [];
        angular.forEach($scope.VisibleRows, function (item) {
            if (item.IsDirty || item.IsDeleted || item.IsNew)
                changes.push(item);
        });
        return changes;
    }
    $scope.Save = function () {
        if ($scope.CommitEditRow($scope.EditingRow) == false)
            return false;
        var changes = $scope.GetChanges();
        common.StartLoading($scope, true);
        if ($scope.SaveCore != null) {
            var result = $scope.SaveCore(changes).then(function (res) {
                var data = common.ResolveData(res);
                if (common.IsValidResponse(data)) {
                    hasChanges = false;
                    common.StopLoadingResponse(data, true, true);
                }
                else {
                    common.StopLoadingResponse(data, false, true);
                }
                if ($scope.RefreshOnSave == true) {
                    $scope.Refresh();
                }
            }, function (res) {
                var data = common.ResolveData(res);
                common.StopLoadingResponse(data, false, $scope, true);
            });
            return result;
        }
        return null;
    }
    $scope.CancelEditRow = function (row) {
        row.Editing = false;
        if (row.IsNew && row.Adding) {
            $scope.Remove(row);
            $scope.EditingRow = null;
        } else {
            common.CopyTo($scope.EditingRowOriginal, $scope.EditingRow, false);
            $scope.EditingRow = null;
        }
    }
    $scope.CommitEdit = function () {
        if ($scope.EditingRow != null)
            return $scope.CommitEditRow($scope.EditingRow);
        return true;
    }
    $scope.CommitEditRow = function (row) {
        if (row == null || row.Editing == false)
            return true;
        if ($scope.ValidateRow(row) == false) {
            $scope.FocusEditingRow();
            return false;
        }
        row.Editing = false;
        row.Adding = false;
        if (row.IsNew == false)
            row.IsDirty = true;
        if ($scope.ImmediateSave == true && $scope.Save != null) {
            var promise = $scope.Save(row);
            spinnerService.during(promise);
        }
        $scope.EditingRow = null;
        $scope.EditingRowIndex = -1;
        hasChanges = true;
        return true;
    }
    $scope.HasChanges = function () {
        return hasChanges;
    }
    $scope.OnRowClicked = function (row) {
        if ($scope.VisibleRows.indexOf(row) != $scope.EditingRowIndex) {
            $scope.CommitEditRow($scope.EditingRow);
        }
    }
    $scope.DataLoaded = function (data) {
        $scope.DataLoadedCore(data);
        $scope.EditingRow = null;
        $scope.EditingRowIndex = -1;
        $scope.EditingRowOriginal = null;
    }
    $scope.FocusEditingRow = function () {
        common.FocusElement("table .editing td:first-child + td .form-control");
    }
    $scope.Remove = function (row) {
        var index = $scope.VisibleRows.indexOf(row);
        $scope.VisibleRows.splice(index, 1);
    };
    $scope.DeleteRow = function (row, askUser) {
        if ($scope.CanDeleteRow(row) == false)
            return;
        if (askUser) {
            common.Confirm("Are you sure, you want delete this row?", function () {
                row.Editing = false;
                row.IsDeleted = true;
                if ($scope.ImmediateSave) {
                    $scope.Save(row);
                    $scope.Remove(row);
                }
                $scope.EditingRow = null;
            });
        }
    }
    $scope.DeleteSelectedRows = function (askUser) {
        var keepGoing = true;
        if (askUser) {
            common.Confirm("Are you sure, you want delete all selected rows?", function () {
                console.log($scope.Selection)
                angular.forEach($scope.Selection.Rows, function (row, key) {
                    if ($scope.CanDeleteRow(row) == false)
                        keepGoing = false;
                    if (keepGoing) {
                        row.Editing = false;
                        row.IsDeleted = true;
                        $scope.Remove(row);
                    }
                    keepGoing = true;
                });
            });
        } else {
            angular.forEach($scope.Selection.Rows, function (row, key) {
                if ($scope.CanDeleteRow(row) == false)
                    keepGoing = false;
                if (keepGoing) {
                    row.Editing = false;
                    row.IsDeleted = true;
                    $scope.Remove(row);
                }
                keepGoing = true;
            });
        }
        if ($scope.ImmediateSave) {
            $scope.Save(row);
        }
    }
    $scope.SetRowVisibility = function (row) {
        return row.IsDeleted == false || row.IsDeleted == undefined;
    }
    $scope.GetTemplate = function (row) {
        if (row == null)
            return "display";
        if (row.Editing)
            return "edit";
        else return "display";
    }
}
