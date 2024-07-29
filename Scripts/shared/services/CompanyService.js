function CompanyService(api, appSettings) {
    var self = this;
    self.GetCompanies = function (request) {
        var result = api.get(appSettings.Api_Company_GetListUrl, request);
        return result;
    }
    self.GetCustomers = function (request) {
        var result = api.get(appSettings.Api_Company_GetCustomersUrl, request);
        return result;
    }
    self.GetSuppliers = function (request) {
        var result = api.get(appSettings.Api_Company_GetSuppliersUrl, request);
        return result;
    }
    self.SaveCompanies = function (request) {
        var result = api.post(appSettings.Api_Company_SaveListUrl, request);
        return result;
    }
    
}