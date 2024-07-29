function AppSession(
    $rootScope,
    $timeout,
    $window,
    $q,
    appSettings,
    sessionContext) {
    var appSession = {};
    
    appSession.Abendon = function () {
        sessionContext.Reset();
    }
    
    appSession.ResetCache = function () {
        //return api.post(appSettings.ApiCacheResetUrl, null);
    }
    appSession.IsAuthenticated = function () {
        return sessionContext != null && sessionContext.Current.IsAuthenticated;
    }
    appSession.GetCurrent = function () {
        return sessionContext.Current;
    }
    appSession.OpenUserProfile = function (userId) {
        $window.open(appSettings.Admin_Item_UserProfileUrl + userId, "_blank");
    }
    appSession.OpenManufacturersPage = function ($scope) {
        var win = window.open(appSettings.Admin_Item_MakesUrl, "_blank");
        win.$windowScope = $scope;
    }
    appSession.OpenModelsPage = function ($scope) {
        var win = window.open(appSettings.Admin_Item_ModelsUrl, "_blank");
        win.$windowScope = $scope;
    }
    appSession.GoToPublished = function ($scope) {
        $window.location.href = appSettings.Admin_Item_PublishedUrl;
    }
    appSession.GoToPartsOnly = function ($scope) {
        $window.location.href = appSettings.Admin_Item_PartsOnlyUrl;
    }
    appSession.GoToSold = function ($scope) {
        $window.location.href = appSettings.Admin_Item_SoldUrl;
    }
    appSession.OpenTitleStatusesPage = function ($scope) {
        var win = window.open(appSettings.Admin_Item_TitleStatusesUrl, "_blank");
        win.$windowScope = $scope;
    }
    appSession.OpenItemClientPage = function (itemId,$scope) {
        var win = window.open(appSettings.Client_ItemClient_Url + "?id=" + itemId, "_blank");
        win.$windowScope = $scope;
    }
    appSession.OpenCompaniesPage = function ($scope) {
        var win = window.open(appSettings.Admin_CompanyList_Url, "_blank");
        win.$windowScope = $scope;
    }
    appSession.OpenPartnersPage = function ($scope) {
        var win = window.open(appSettings.Admin_Management_PartnersUrl, "_blank");
        win.$windowScope = $scope;
    }
    appSession.OpenTitleBrandsPage = function ($scope) {
        var win = window.open(appSettings.Admin_Item_TitleBrandsUrl, "_blank");
        win.$windowScope = $scope;
    }
    appSession.OpenExpenseTypes = function ($scope) {
        var win = window.open(appSettings.Admin_Item_ExpenseTypesUrl, "_blank");
        win.$windowScope = $scope;
    }
    appSession.OpenTitleStatusTracking = function ($scope,itemId) {
        var win = window.open(appSettings.Admin_Item_ItemTitleStatusTrackingUrl+"?itemId="+itemId, "_blank");
        win.$windowScope = $scope;
    }
    return appSession;
};