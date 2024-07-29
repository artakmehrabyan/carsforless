function ManagementService(appSettings, appSession, api,notifyService) {
    var self = {};
    self.ResetCache = function () {
        var promise = api
            .post(appSettings.Api_Management_ResetCache)
            .then(function(r) {
                if (r.data == true) {
                    notifyService.info("Cache Reset", "Cache has been reset!");
                }
            });
        return promise;
    }
    self.GetImageUrl = function (name, dir) {
        var url = null;
        if (dir != null) {
            url = appSettings.CarImagesUrl + "/" + dir + "/" + name;
        } else {
            url = appSettings.CarImagesUrl + "/" + name;
        }
        return url;
    }
    self.ResolveMainImage = function (item) {
        if (item.ImageUrl != null && item.ImageUrl !='') {
            return item.ImageUrl;
        }
        return self.GetImageUrl('no-car-image-lg.jpg');
    }
    self.GetPartners=function() {
        var result = api.get(appSettings.Api_Management_GetPartners,null);
        return result;
    }
    self.SavePartners = function (models) {
        var result = api.post(appSettings.Api_Management_SavePartners, models);
        return result;
    }
    self.RunSql = function (sql) {
        var result = api.post(appSettings.Api_Management_RunSql, {sql:sql});
        return result;
    }
    return self;
}

