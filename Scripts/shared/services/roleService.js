function RoleService(api, appSettings, spinnerService, appSession) {
    var self = {};

    self.GetRolesList = function (model) {
        return api.get(appSettings.GroupsUrl, model);
    };
    self.GetGroup = function (id) {
        return api.get("/management/getuserrole/", { id: id });
    }
    self.AddGroup = function (model) {
        return api.post(appSettings.AddUserRoleUrl, model);
    }
    self.UpdateGroup = function (model) {
        return api.post(appSettings.UpdateUserRoleUrl, model);
    }
    self.DeleteGroup = function (model) {
        return api.post(appSettings.DeleteUserRoleUrl, model);
    }
    return self;
}