function LogService(api) {
    var self = {};
    self.GetLogs = function (model) {
        return api.get("/management/getlogs", model);
    };
    return self;
}