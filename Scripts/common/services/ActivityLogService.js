function ActivityLogService(api) {
    var self = {};
    self.GetActivityLogs = function (model) {
        return api.get("/management/getactivitylogs", model);
    };

    self.GetActivityLogTypes = function (model) {
        return api.get('/management/getactivitylogtypes', model);
    };

    return self;
}