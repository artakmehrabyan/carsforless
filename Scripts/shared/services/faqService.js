function FaqService(appSettings, appSession, api) {
    var self = {};

 
    self.AddFaq = function(faq) {
        return api.post(appSettings.ApiFaqAdd, faq);
    }

    self.UpdateFaq = function (faq) {
        return api.post(appSettings.ApiFaqUpdate, faq);
    }

    self.DeleteFaq = function (faq) {
        return api.post(appSettings.ApiFaqDelete, faq);
    };

    self.GetFaqList = function(model) {
        return api.get(appSettings.ApiFaqUserList, model);
    }
    self.GetTargetRoles = function() {
        var roles = [{ Name: "Resellers" }, { Name: "Users" }];
        return roles;
    }

    return self;
}

