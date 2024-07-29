function ItemIssuesController(
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
        $scope.GridModel.OrderBy = "CreatedOn";
        $scope.GridModel.OrderDirection = "Desc";
        $scope.IssueTypes = [];
       
        $scope.IssueTypes.push({
            Id: 1,
            Name: "None"
        });
        $scope.IssueTypes.push({
            Id: 2,
            Name: "Body / Windows/Sun"
        });
        $scope.IssueTypes.push({
            Id: 3,
            Name: "Breaks /Rotors"
        });
        $scope.IssueTypes.push({
            Id: 4,
            Name: "Tires / Pressure"
        });
        $scope.IssueTypes.push({
            Id: 5,
            Name: "Electric systems"
        });
        $scope.IssueTypes.push({
            Id: 6,
            Name: "Body / Windows/Sunroof"
        });
        $scope.IssueTypes.push({
            Id: 7,
            Name: "Interior"
        });
        $scope.IssueTypes.push({
            Id: 8,
            Name: "Miscellaneous"
        });

        $scope.IssueStatuses = [];
        $scope.IssueStatuses.push({
            Id: -1,
            Name: "Unknown"
        });
        $scope.IssueStatuses.push({
            Id: 0,
            Name: "InProcess"
        });
        $scope.IssueStatuses.push({
            Id: 1,
            Name: "Fixed"
        });

        $scope.$watch("VisibleRows", function (newValue, oldValue) {
            if (oldValue != newValue) {
                $scope.EditableObject.Issues = newValue;
            }
        }, true);
        $rootScope.$on("ItemLoaded", function () {
            $scope.LoadIssues();
        });
        $rootScope.$on("ItemSaving", function (event, item) {
            var commit = $scope.CommitEdit();
            item.IsValid = commit;
        });
       
        $rootScope.$on("LoadIssues", function () {
            $scope.LoadIssues();
        });
    }

    $scope.ImmediateSave = false;
    $scope.NewRowAddedScrolling = false;

   $scope.GetIssueStatus=function(status) {
       var item = $filter('filter')($scope.IssueStatuses, { 'Id': status });
       return item != null ? item[0].Name : "";
   }
    $scope.GetIssueType = function (type) {
        var item = $filter('filter')($scope.IssueTypes, { 'Id': type });
        return item != null ? item[0].Name : "";
    }
    $scope.LoadIssues = function (tableState) {
        var issues = $scope.EditableObject.Issues;
        if (issues != null) {
            $scope.VisibleRows = issues;
        }
        return issues;
    }

    $scope.CreateNewRow = function () {
        var now = $filter('date')(new Date(), 'MM/dd/yyyy');
        var row = {
            Id: 0,
            IssueName: '',
            IssueType: 1,
            IssueStatus: 0,//InProcess
            CreatedOn: now,
            EstimatedOn: now,
            RepairCost: 0,
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
            if (row.RepairCost == null) {
                messages += "RepairCost is invalid";
            }
            if (row.IssueType == null || row.IssueType == '') {
                messages += "</br>IssueType is invalid";
            }
            if (row.IssueName == null || row.IssueName == '') {
                messages += "</br>IssueName is invalid";
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
            return "displayissue";
        if (row.Editing)
            return "editissue";
        else return "displayissue";
    }

    $scope.DoInit();
}