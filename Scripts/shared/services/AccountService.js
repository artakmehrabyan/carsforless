function AccountService(appSettings, appSession, api, notifyService) {
    var self = {};
    self.GetCurrentUser = function (request) {
        var promise = api.get(appSettings.Api_Account_GetCurrentUserUrl, request);
        return promise;
    }
    self.GetUsers = function (model) {
        var promise = api.get(appSettings.Api_Account_GetUsersUrl, model);
        return promise;
    };
    self.GetUsersPaged = function (model) {
        var promise = api.get(appSettings.Api_Account_GetUsersPagedUrl, model);
        return promise;
    };
    self.Delete = function (user) {
        return api.post(appSettings.Api_Account_DeleteUrl, user);
    };
    self.GetUser = function (id) {
        return api.get(appSettings.Api_Account_GetUrl, { userId: id });
    };
    self.GetRoles = function (request) {
        return api.get(appSettings.Api_Account_GetRolesUrl, request);
    };
    self.Create = function (request) {
        return api.post(appSettings.Api_Account_CreateUrl, request);
    };
    self.Update = function (request) {
        return api.post(appSettings.Api_Account_UpdateUrl, request);
    };
    self.ChangePassword = function (request) {
        return api.post(appSettings.Api_Account_ChangePasswordUrl, request);
    };
    return self;
}

