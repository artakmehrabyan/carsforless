core.service("req", RequestHelper);
core.service("ord", OrderService);
core.service("faqService", FaqService);
core.service("roleService", RoleService);
core.service("activityLogService", ActivityLogService);
core.service("logService", LogService);
core.service("resources", Resources);
core.service("manage", ManagementService);
core.service("companyService", CompanyService);
core.service("itemService", ItemService);
core.service("accountService", AccountService);

core.controller("OrderListControllerBase", OrderListControllerBase);


core.run(function ($rootScope, common,manage, appSession,resources,sessionContext,store) {
    $rootScope.AppServices = {
        Common: common,
        Session: appSession,
        Resources:resources,
        SessionContext:sessionContext,
        Management: manage,
        Store: store,
        
    };
   
});
core.filter('unique', function () {
    return function (collection, keyname) {
        var output = [],
            keys = [],
        found = [];

        if (!keyname) {

            angular.forEach(collection, function (row) {
                var is_found = false;
                angular.forEach(found, function (foundRow) {

                    if (foundRow == row) {
                        is_found = true;
                    }
                });

                if (is_found) { return; }
                found.push(row);
                output.push(row);

            });
        }
        else {

            angular.forEach(collection, function (row) {
                var item = row[keyname];
                if (item === null || item === undefined) return;
                if (keys.indexOf(item) === -1) {
                    keys.push(item);
                    output.push(row);
                }
            });
        }

        return output;
    };
});
core.filter("percentage", ['$filter', function ($filter) {
    return function (input, decimals) {
        return $filter('number')(input * 100, decimals) + '%';
    };
}]);
core.filter('sum', function () {
    return function (data, key) {
        if (typeof (data) === 'undefined' || typeof (key) === 'undefined') {
            return 0;
        }

        var sum = 0;
        for (var i = data.length - 1; i >= 0; i--) {
            sum += parseInt(data[i][key]);
        }

        return sum;
    };
});

core.filter('retail', function ($filter) {
    var currencyFilter = $filter('number');
    return function (amount, currencySymbol) {
        if (amount == null)
            return "";
        if (amount == 0)
            return 'Call for price';
        return '$' + currencyFilter(amount, currencySymbol);
    }
});
