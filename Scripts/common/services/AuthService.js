function AuthenticationService(
    $http,
    $window,
    $location,
    $timeout,
    $q,
    $document,
    common,
    req,
    sessionContext,
    appSettings){

    var authService = {};
    var serviceBase = appSettings.serviceUrl($location) + "/api";

    authService.Login = function (credentials, scope) {
        var deferred = $q.defer();
        if (authService.IsAuthenticated())
            return deferred.promise;
       
        //var params = $.param({
        //    UserName: credentials.UserName,
        //    Password: credentials.Password,
        //    __RequestVerificationToken: credentials.Antiforgery,
        //    returnUrl: credentials.ReturnUrl
        //});
        common.StartLoading(scope,true);
        req.Post(appSettings.Client_Login_Url, credentials)
            .then(function (res) {
                var result = common.ResolveData(res);
                if (result.IsAuthenticated === true) {
                    scope.Succeeded = true;
                    authService
                        .GetApiToken(credentials.UserName, credentials.Password)
                        .then(function (response) {
                            if (response.access_token != null) {
                                sessionContext.SetSession(
                                    result.UserId,
                                    credentials.UserName,
                                    result.IsAdmin,
                                    result.IsReseller,
                                    result.ApiKey,
                                    response.access_token,
                                    result.IsAuthenticated,
                                    3600//hour
                                );
                                common.StopLoading(result.Message, true, scope);
                                common.RedirectWithDelay(result.ReturnUrl, 100);
                            }
                        });
                    deferred.resolve(result);
                }
            },function(response) {
                common.StopLoadingResponse(response, false, scope,true);
                deferred.reject(response);
            });
        return deferred.promise;
    };
    
    authService.GetApiToken = function (login, password) {
        var data = "access_type=offline&grant_type=password&username=" + login + "&password=" + password;
        var deferred = $q.defer();
        var config = {
            headers: { 'Content-Type': "application/x-www-form-urlencoded" }
        };
        $http.post(serviceBase + "/token", data, config).success(function (response) {
            deferred.resolve(response);
        }).error(function (err, status) {
            deferred.reject(err);
        });

        return deferred.promise;
    };

    

    authService.IsAuthenticated = function () {
        return !!sessionContext.IsAuthenticated();
    };


    authService.Register = function (model, scope) {
        var deferred = $q.defer();
        var url = appSettings.Client_Register_Url;
        common.StartLoading(scope);
        req.Post(url, model)
            .then(function(res) {
                var result = res;
                if (common.IsValidResponse(res) && result.Result.Succeeded === true) {
                    if (result.RedirectUrl != null) {
                        common.StopLoading(result.Message, true, scope);
                        common.RedirectWithDelay(result.RedirectUrl);
                    }
                } else {
                    var message = common.GetResponseMessage(res);
                    common.StopLoading(message, false, scope);
                }
                deferred.resolve(res);

            }, function (data) {
                common.StopLoadingResponse(data, false, scope);
                deferred.reject(data);
            });
        return deferred.promise;
    }

    authService.ForgotPassword = function(model, scope) {
        var deferred = $q.defer();
       
        common.StartLoading(scope);
        var url = appSettings.Client_ForgotPassword_Url;

        req.Post(url, model)
            .then(function (res) {
                var result = res;
                if (common.IsValidResponse(res) && result.Succeeded === true) {
                    if (result.ReturnUrl != null) {
                        common.StopLoading(result.Message, true, scope);
                    }
                    deferred.resolve(res);
                } else {
                    var message = common.GetResponseMessage(res);
                    common.StopLoading(message, false, scope);
                    deferred.reject(res);
                }
            });
        var promise = deferred.promise;
        return promise;
    }
    authService.ResetPassword = function (model, scope) {
        var deferred = $q.defer();
        common.StartLoading(scope);
        var url = appSettings.Client_ResetPassword_Url;
        req.Post(url,model)
            .then(function(res) {
                var result = res;
                if (common.IsValidResponse(res) && result.Succeeded === true) {
                    if (result.ReturnUrl != null) {
                        common.StopLoading(res.Message, true, scope);
                        common.RedirectWithDelay(result.ReturnUrl);
                    }
                    deferred.resolve(res);
                } else {
                    var message = common.GetResponseMessage(res);
                    common.StopLoading(message, false, scope);
                    deferred.reject(res);
                }
            });
        return deferred.promise;
    }
    return authService;
}